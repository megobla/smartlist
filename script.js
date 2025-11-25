// State Management
let products = [];

// DOM Elements
const emptyState = document.getElementById('emptyState');
const productsList = document.getElementById('productsList');
const productsContainer = document.getElementById('productsContainer');
const headerAddBtn = document.getElementById('headerAddBtn');
const addProductModal = document.getElementById('addProductModal');
const addProductForm = document.getElementById('addProductForm');
const productNameInput = document.getElementById('productName');
const cancelBtn = document.getElementById('cancelBtn');
const totalPriceEl = document.getElementById('totalPrice');
const itemCountEl = document.getElementById('itemCount');
const progressBar = document.getElementById('progressBar');

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
    // Open modal
    headerAddBtn.addEventListener('click', openModal);

    // Close modal
    cancelBtn.addEventListener('click', closeModal);
    addProductModal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // Form submission
    addProductForm.addEventListener('submit', handleAddProduct);
}

// Open Modal
function openModal() {
    addProductModal.classList.add('show');
    productNameInput.focus();
}

// Close Modal
function closeModal() {
    addProductModal.classList.remove('show');
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
        quantity: 0.0,
        completed: false
    };

    products.push(newProduct);
    saveProducts();
    renderProducts();
    closeModal();
}

// Toggle Product Completion
function toggleProduct(id) {
    products = products.map(product =>
        product.id === id
            ? { ...product, completed: !product.completed }
            : product
    );
    saveProducts();
    renderProducts();
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
                <button class="checkbox-btn ${product.completed ? 'checked' : ''}" onclick="toggleProduct('${product.id}')">
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
    const totalPrice = products.reduce((sum, product) =>
        sum + (product.price * product.quantity), 0
    );
    const progress = products.length > 0 ? (completedCount / products.length) * 100 : 0;

    totalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;
    itemCountEl.textContent = `${completedCount} of ${products.length}`;

    // Update progress circle
    const circumference = 2 * Math.PI * 29;
    const offset = circumference * (1 - progress / 100);
    progressBar.style.strokeDasharray = circumference;
    progressBar.style.strokeDashoffset = offset;
    progressBar.style.transition = 'stroke-dashoffset 0.5s ease-out';
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
