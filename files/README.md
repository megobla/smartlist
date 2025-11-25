# SmartList - Vanilla HTML/CSS/JS Version

This is a plain HTML, CSS, and JavaScript version of the SmartList application

## Features

- Add products to your shopping list
- Mark items as completed with visual checkboxes
- Set price and quantity for each item
- Real-time total price calculation
- Progress tracking (completed vs. total items)
- Data persistence using localStorage
- Responsive design
- Clean, modern UI

## File Structure

```
vanilla/
├── index.html          # Main HTML file
├── styles.css          # All styles (converted from Tailwind)
├── script.js           # Application logic (state management, localStorage)
├── assets/
│   ├── logo.png        # SmartList logo
│   └── empty-state.png # Empty state illustration
└── README.md           # This file
```

## How to Open with Live Server

### Option 1: Using Python's Built-in Server

1. Open your terminal/command prompt
2. Navigate to the vanilla directory:
   ```bash
   cd "C:\Users\marye\OneDrive\Documents\Mary\Work\SmartList\SampleCode\vanilla"
   ```
3. Run Python's HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000

   # Or Python 2
   python -m SimpleHTTPServer 8000
   ```
4. Open your browser and go to: `http://localhost:8000`

### Option 2: Using Node.js http-server

1. Install http-server globally (one-time setup):
   ```bash
   npm install -g http-server
   ```
2. Navigate to the vanilla directory:
   ```bash
   cd "C:\Users\marye\OneDrive\Documents\Mary\Work\SmartList\SampleCode\vanilla"
   ```
3. Run the server:
   ```bash
   http-server
   ```
4. Open your browser and go to the URL shown (usually `http://localhost:8080`)

### Option 3: Using VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Open the vanilla folder in VS Code
3. Right-click on `index.html`
4. Select "Open with Live Server"

### Option 4: Direct File Opening (Not Recommended)

You can also just double-click `index.html` to open it directly in your browser, but this method may have limitations with some features.

## How It Works

### State Management
- All product data is stored in a JavaScript array
- Data is automatically saved to localStorage on every change
- Data is loaded from localStorage when the page loads

### Key Functions
- `addProduct()` - Adds a new product to the list
- `toggleProduct()` - Marks a product as completed/incomplete
- `removeProduct()` - Removes a product from the list
- `updatePrice()` - Updates the price of a product
- `updateQuantity()` - Updates the quantity of a product
- `renderProducts()` - Re-renders the entire product list
- `updateFooter()` - Updates the footer with totals and progress

### Data Structure
Each product has the following structure:
```javascript
{
    id: "1234567890",        // Timestamp-based unique ID
    name: "Product Name",     // Product name
    price: 0.0,              // Price per unit
    quantity: 0.0,           // Quantity
    completed: false         // Completion status
}
```

## Differences from React Version

1. **No Build Process**: This version runs directly in the browser without any build tools
2. **No Dependencies**: No need for npm packages or node_modules
3. **Direct DOM Manipulation**: Uses vanilla JavaScript instead of React's virtual DOM
4. **Global Functions**: Event handlers are attached as onclick attributes for simplicity
5. **Single HTML File**: All markup is in one file instead of split into components
6. **Inline SVG Icons**: Uses inline SVG instead of lucide-react icon library

## Browser Compatibility

This application works in all modern browsers that support:
- ES6 JavaScript (2015+)
- CSS Grid and Flexbox
- localStorage API
- SVG

Tested in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

Potential improvements you could make:
- Add categories for products
- Add search/filter functionality
- Export/import shopping lists
- Add product images
- Implement undo/redo functionality
- Add keyboard shortcuts
- Add drag-and-drop reordering
