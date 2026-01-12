// script.js — Refactored (modular, delegated events, safer storage)
//
// - Uses event delegation on #productsContainer
// - Native checkbox: <input type="checkbox" class="product-checkbox" id="chk-..."> + <label class="checkbox-btn" for="chk-...">
// - updateProduct helper centralizes product updates
// - computeTotals is pure
// - Safe localStorage parsing

const STORAGE_KEY = 'smartlist-products';

// App state
let products = [];

// DOM refs
const emptyState = document.getElementById('emptyState');
const productsList = document.getElementById('productsList');
const productsContainer = document.getElementById('productsContainer');
const headerAddBtn = document.getElementById('headerAddBtn');
const addProductForm = document.getElementById('addProductForm');
const addProductFormContainer = document.getElementById('addProductFormContainer');
const formCloseBtn = document.getElementById('formCloseBtn');
const productNameInput = document.getElementById('productName');
const discountInput = document.getElementById('discountInput');
const discountSection = document.querySelector('.discount-section');
const header = document.querySelector('.header');
const footer = document.querySelector('.footer');
const announcer = document.getElementById('announcer');

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

// Utility — safe parse
function safeLoadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to parse products from storage', e);
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function saveProducts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Failed to save products', e);
  }
}

// Pure helper
function computeTotals(items, discountPercent = 0) {
  const subtotal = items.reduce((s, p) => s + (Number(p.price || 0) * Number(p.quantity || 0)), 0);
  const discount = Math.round((subtotal * (Number(discountPercent) || 0)) / 100 * 100) / 100;
  const total = Math.round((subtotal - discount) * 100) / 100;
  const completed = items.filter(p => p.completed).length;
  return { subtotal, discount, total, completed, count: items.length };
}

// Central update helper — returns true if updated
function updateProduct(id, patch) {
  let changed = false;
  products = products.map(p => {
    if (p.id !== id) return p;
    changed = true;
    return { ...p, ...patch };
  });
  if (changed) saveProducts();
  return changed;
}

// Initialize App
function init() {
    products = safeLoadProducts();
    renderProducts();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Open add form
    headerAddBtn?.addEventListener('click', openAddProductUI);

    // Close add form
    formCloseBtn?.addEventListener('click', closeAddProductUI);

    // Form submission
    addProductForm?.addEventListener('submit', onAddProductSubmit);

    // Discount input
    discountInput?.addEventListener('input', updateFooter);

    // Delegated events for product actions
    productsContainer?.addEventListener('click', onProductsContainerClick);
    productsContainer?.addEventListener('change', onProductsContainerChange);
}


// Open add product UI
function openAddProductUI() {
    if (addProductFormContainer) {
        addProductFormContainer.style.display = 'block';
        headerAddBtn.style.display = 'none';
        productNameInput?.focus();
    }
}

// Close add product UI
function closeAddProductUI() {
    if (addProductFormContainer) {
        addProductFormContainer.style.display = 'none';
        headerAddBtn.style.display = 'inline-flex';
        addProductForm?.reset();
        headerAddBtn?.focus();
    }
}

// Add Product
function onAddProductSubmit(e) {
    e.preventDefault();

    const name = (productNameInput?.value || '').trim();
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
    closeAddProductUI();
    announce('Item added');
}

// Toggle Product Completion (via native checkbox change event)
// Handled in onProductsContainerChange

// Remove Product
function removeProduct(id) {
    products = products.filter(product => product.id !== id);
    saveProducts();
    renderProducts();
    announce('Item removed');
}

// Update Price
function updatePrice(id, price) {
    updateProduct(id, { price: parseFloat(price) || 0 });
    updateFooter();
}

// Handle Price Focus - Clear "0" when clicked
function handlePriceFocus(event) {
    if (event.target.value === '0') {
        event.target.value = '';
    }
}

// Handle Discount Focus - Clear "0" when clicked
function handleDiscountFocus(event) {
    if (event.target.value === '0' || event.target.value === '') {
        event.target.value = '';
    }
}

// Update Quantity
function updateQuantity(id, quantity) {
    const qty = Math.max(0, parseInt(quantity, 10) || 0);
    updateProduct(id, { quantity: qty });
    updateFooter();
}

// Increment Quantity
function incrementQuantity(id) {
    const current = Number(products.find(p => p.id === id)?.quantity || 0);
    updateProduct(id, { quantity: current + 1 });
    renderProducts();
}

// Decrement Quantity
function decrementQuantity(id) {
    const current = Number(products.find(p => p.id === id)?.quantity || 0);
    updateProduct(id, { quantity: Math.max(0, current - 1) });
    renderProducts();
}

// Create Product Card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.innerHTML = `
        <div class="product-card-inner">
            <!-- Top row -->
            <div class="product-card-top">
                <input type="checkbox" id="chk-${product.id}" class="product-checkbox" ${product.completed ? 'checked' : ''} />
                <label for="chk-${product.id}" class="checkbox-btn" aria-hidden="true">
                    <svg class="checkbox-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#000000" stroke-width="2">
                        <path d="M5 10l3 3 7-7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </label>

                <p class="product-title ${product.completed ? 'completed' : ''}">${escapeHtml(product.name)}</p>

                <button class="remove-btn" data-action="remove" aria-label="Remove ${escapeHtml(product.name)}">
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
                    <label class="input-label" for="price-${product.id}">Price ($)</label>
                    <input
                        id="price-${product.id}"
                        type="number"
                        class="form-input"
                        data-type="price"
                        value="${product.price}"
                        onfocus="handlePriceFocus(event)"
                        step="0.01"
                        min="0"
                    />
                </div>

                <!-- Quantity Input -->
                <div class="input-group">
                    <label class="input-label" for="qty-${product.id}">Qty</label>
                    <div class="quantity-input-wrapper">
                        <button class="quantity-btn quantity-btn-minus" data-action="decrement" aria-label="Decrease quantity for ${escapeHtml(product.name)}">
                            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>

                        <input
                            id="qty-${product.id}"
                            type="number"
                            class="form-input"
                            data-type="qty"
                            value="${product.quantity}"
                            step="1"
                            min="0"
                        />

                        <button class="quantity-btn quantity-btn-plus" data-action="increment" aria-label="Increase quantity for ${escapeHtml(product.name)}">
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

    // Calculate subtotal (sum of only checked/completed items)
    const subtotal = products
        .filter(product => product.completed)
        .reduce((sum, product) => sum + (product.price * product.quantity), 0);

    // Get discount percentage from input
    const discountPercent = parseFloat(discountInput.value) || 0;
    const discount = Math.round((subtotal * discountPercent) / 100 * 100) / 100;

    // Calculate total
    const total = Math.round((subtotal - discount) * 100) / 100;

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
        discountSection.style.display = 'none';
        footer.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        productsList.style.display = 'block';
        discountSection.style.display = 'block';
        footer.style.display = 'block';

        // Sort products: uncompleted first, completed last
        const sortedProducts = [...products].sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
        });

        // Render each product using document fragment
        const frag = document.createDocumentFragment();
        sortedProducts.forEach(product => {
            const card = createProductCard(product);
            frag.appendChild(card);
        });
        productsContainer.appendChild(frag);
    }

    // Update footer
    updateFooter();
}

// Event delegation for product container — click events
function onProductsContainerClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const card = btn.closest('.product-card');
    if (!card) return;
    const id = card.dataset.id;
    if (!id) return;

    if (action === 'remove') {
        removeProduct(id);
    } else if (action === 'increment') {
        incrementQuantity(id);
    } else if (action === 'decrement') {
        decrementQuantity(id);
    }
}

// Event delegation for product container — change events (checkbox, inputs)
function onProductsContainerChange(e) {
    const input = e.target.closest('input');
    if (!input) return;
    const card = input.closest('.product-card');
    if (!card) return;
    const id = card.dataset.id;
    if (!id) return;

    // Handle checkbox
    if (input.type === 'checkbox' && input.classList.contains('product-checkbox')) {
        updateProduct(id, { completed: input.checked });

        // Find the checkbox button (label) and show active state
        const checkboxBtn = card.querySelector('.checkbox-btn');
        if (checkboxBtn) {
            checkboxBtn.classList.add('active');

            // Wait for animation to be visible, then move to bottom
            setTimeout(() => {
                checkboxBtn.classList.remove('active');
                renderProducts();
                announce(input.checked ? 'Marked item complete' : 'Marked item incomplete');
            }, 400);
        } else {
            // Fallback if checkbox button not found
            renderProducts();
            announce(input.checked ? 'Marked item complete' : 'Marked item incomplete');
        }

        return;
    }

    // Handle number inputs (price, qty)
    const type = input.dataset.type;
    if (type === 'price') {
        updatePrice(id, input.value);
    } else if (type === 'qty') {
        updateQuantity(id, input.value);
    }
}

// Announce helper (aria-live)
function announce(message) {
    if (!announcer) return;
    announcer.textContent = message;
    setTimeout(() => (announcer.textContent = ''), 1000);
}

// Escape HTML
function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, (s) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
    }[s]));
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
