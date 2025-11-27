// State Management
let products = [];

// Helper function to format currency (Latin American format)
function formatCurrency(amount) {
    // Format with 2 decimal places
    const formatted = amount.toFixed(2);
    // Split into integer and decimal parts
    const [integer, decimal] = formatted.split('.');
    // Add thousand separators (dots)
    const withThousands = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // Join with comma as decimal separator
    return `$${withThousands},${decimal}`;
}

// DOM Elements
const emptyState = document.getElementById('emptyState');
const productsList = document.getElementById('productsList');
const productsContainer = document.getElementById('productsContainer');
const headerAddBtn = document.getElementById('headerAddBtn');
const addProductFormContainer = document.getElementById('addProductFormContainer');
const addProductForm = document.getElementById('addProductForm');
const productNameInput = document.getElementById('productName');
const formCloseBtn = document.getElementById('formCloseBtn');
const discountInput = document.getElementById('discountInput');

// Initialize App
function init() {
    loadProducts();
    renderProducts();
    setupEventListeners();
}

// Load products from localStorage
function loadProducts() {
    const savedProducts = localStorage.getItem('smartlist-products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('smartlist-products', JSON.stringify(products));
}

// Setup Event Listeners
function setupEventListeners() {
    // Toggle form
    headerAddBtn.addEventListener('click', toggleForm);

    // Close form
    formCloseBtn.addEventListener('click', closeForm);

    // Form submission
    addProductForm.addEventListener('submit', handleAddProduct);

    // Discount input
    discountInput.addEventListener('input', updateFooter);
}

// Toggle Form
function toggleForm() {
    if (addProductFormContainer.style.display === 'none') {
        addProductFormContainer.style.display = 'block';
        productNameInput.focus();
    } else {
        closeForm();
    }
}

// Close Form
function closeForm() {
    addProductFormContainer.style.display = 'none';
    productNameInput.value = '';
}

// Add Product
function handleAddProduct(e) {
    e.preventDefault();

    const name = productNameInput.value.trim();
    if (!name) return;

    const newProduct = {
        id: Date.now().toString(),
        name: name,
        price: 0.0,
        quantity: 1,
        completed: false
    };

    products.unshift(newProduct);
    saveProducts();
    renderProducts();
    closeForm();
}

// Toggle Product Completion
function toggleProduct(id, event) {
    // Find the product to check if it's being completed (not unchecked)
    const product = products.find(p => p.id === id);
    const isBeingCompleted = product && !product.completed;

    products = products.map(product =>
        product.id === id
            ? { ...product, completed: !product.completed }
            : product
    );
    saveProducts();
    renderProducts();

    // Add bounce animation after rendering (only when completing)
    if (isBeingCompleted) {
        // Wait for DOM to update, then find the card and animate it
        setTimeout(() => {
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                const checkbox = card.querySelector('.checkbox-btn');
                if (checkbox && checkbox.onclick && checkbox.onclick.toString().includes(id)) {
                    card.classList.add('bounce');
                    setTimeout(() => {
                        card.classList.remove('bounce');
                    }, 250);
                }
            });
        }, 10);
    }
}

// Remove Product
function removeProduct(id) {
    products = products.filter(product => product.id !== id);
    saveProducts();
    renderProducts();
}

// Update Price
function updatePrice(id, price) {
    products = products.map(product =>
        product.id === id
            ? { ...product, price: parseFloat(price) || 0 }
            : product
    );
    saveProducts();
    updateFooter();
}

// Handle Price Focus - Clear "0" when clicked
function handlePriceFocus(event) {
    if (event.target.value === '0') {
        event.target.value = '';
    }
}

// Update Quantity
function updateQuantity(id, quantity) {
    const qty = parseFloat(quantity) || 0;
    products = products.map(product =>
        product.id === id
            ? { ...product, quantity: Math.max(0, qty) }
            : product
    );
    saveProducts();
    updateFooter();
}

// Increment Quantity
function incrementQuantity(id) {
    products = products.map(product =>
        product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product
    );
    saveProducts();
    renderProducts();
}

// Decrement Quantity
function decrementQuantity(id) {
    products = products.map(product =>
        product.id === id
            ? { ...product, quantity: Math.max(0, product.quantity - 1) }
            : product
    );
    saveProducts();
    renderProducts();
}

// Create Product Card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-card-inner">
            <!-- Top row -->
            <div class="product-card-top">
                <button class="checkbox-btn ${product.completed ? 'checked' : ''}" onclick="toggleProduct('${product.id}', event)">
                    <svg class="checkbox-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#000000" stroke-width="2">
                        <path d="M5 10l3 3 7-7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>

                <p class="product-title ${product.completed ? 'completed' : ''}">${product.name}</p>

                <button class="remove-btn" onclick="removeProduct('${product.id}')">
                    <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <!-- Price and Quantity -->
            <div class="product-inputs">
                <!-- Price Input -->
                <div class="input-group">
                    <label class="input-label">Price ($)</label>
                    <input
                        type="number"
                        class="form-input"
                        value="${product.price}"
                        onfocus="handlePriceFocus(event)"
                        onchange="updatePrice('${product.id}', this.value)"
                        step="0.01"
                        min="0"
                    />
                </div>

                <!-- Quantity Input -->
                <div class="input-group">
                    <label class="input-label">Qty</label>
                    <div class="quantity-input-wrapper">
                        <button class="quantity-btn quantity-btn-minus" onclick="decrementQuantity('${product.id}')">
                            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>

                        <input
                            type="number"
                            class="form-input"
                            value="${product.quantity}"
                            onchange="updateQuantity('${product.id}', this.value)"
                            step="1"
                            min="0"
                        />

                        <button class="quantity-btn quantity-btn-plus" onclick="incrementQuantity('${product.id}')">
                            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return card;
}

// Update Footer
function updateFooter() {
    const completedCount = products.filter(p => p.completed).length;
    const totalCount = products.length;

    // Calculate subtotal (sum of all items)
    const subtotal = products.reduce((sum, product) =>
        sum + (product.price * product.quantity), 0
    );

    // Get discount percentage from input
    const discountPercent = parseFloat(discountInput.value) || 0;
    const discount = (subtotal * discountPercent) / 100;

    // Calculate total
    const total = subtotal - discount;

    // Update footer values
    const subtotalValue = document.querySelector('.subtotal-value');
    const discountValue = document.querySelector('.discount-value');
    const totalValue = document.querySelector('.total-value');
    const metadata = document.querySelector('.footer-metadata');

    if (subtotalValue) subtotalValue.textContent = formatCurrency(subtotal);
    if (discountValue) discountValue.textContent = `-${formatCurrency(discount).substring(1)}`;
    if (totalValue) totalValue.textContent = formatCurrency(total);
    if (metadata) metadata.textContent = `${completedCount} of ${totalCount} items checked`;
}

// Render Products
function renderProducts() {
    // Clear container
    productsContainer.innerHTML = '';

    // Show/hide empty state
    if (products.length === 0) {
        emptyState.style.display = 'flex';
        productsList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        productsList.style.display = 'block';

        // Render each product
        products.forEach(product => {
            const card = createProductCard(product);
            productsContainer.appendChild(card);
        });
    }

    // Update footer
    updateFooter();
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
