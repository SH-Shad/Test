// script.js
let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: "Product Name", price: 1.00 },
];

let cart = JSON.parse(localStorage.getItem('cart')) || {};

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

window.onload = function() {
    displayProducts();
    updateCartDisplay();
};

function displayProducts(searchTerm = '') {
    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = '';
    products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase())).forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.innerHTML = `
            ${product.name} - $${product.price.toFixed(2)}
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="editProduct(${product.id})">Edit</button>
            <button onclick="deleteProduct(${product.id})">Delete</button>
        `;
        productsDiv.appendChild(productDiv);
    });
}

function searchProducts() {
    const searchTerm = document.getElementById("productSearch").value;
    displayProducts(searchTerm);
}

function addToCart(productId) {
    if (!cart[productId]) {
        cart[productId] = { ...products.find(p => p.id === productId), quantity: 0 };
    }
    cart[productId].quantity++;
    updateCartDisplay();
    saveCart();
}

function removeFromCart(productId) {
    if (cart[productId].quantity > 1) {
        cart[productId].quantity--;
    } else {
        delete cart[productId];
    }
    updateCartDisplay();
    saveCart();
}

function updateCartDisplay() {
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";
    Object.values(cart).forEach(item => {
        const itemLi = document.createElement("li");
        itemLi.innerText = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;
        const removeButton = document.createElement("button");
        removeButton.innerText = "Remove";
        removeButton.onclick = function() { removeFromCart(item.id); };
        itemLi.appendChild(removeButton);
        cartItems.appendChild(itemLi);
    });

    const total = Object.values(cart).reduce((acc, item) => acc + item.price * item.quantity, 0);
    document.getElementById("total").innerText = total.toFixed(2);
}

function checkout() {
    // Generate a simple receipt
    const receipt = Object.values(cart).map(item => 
        `${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    alert(`Receipt:\n${receipt}\nTotal: $${document.getElementById("total").innerText}`);
    cart = {};
    updateCartDisplay();
    saveCart();
}

function addNewProduct() {
    const nameInput = document.getElementById("newProductName");
    const priceInput = document.getElementById("newProductPrice");
    const newName = nameInput.value.trim();
    const newPrice = parseFloat(priceInput.value);
    
    if (!newName || isNaN(newPrice)) {
        return alert("Invalid product name or price");
    }
    
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: newId, name: newName, price: newPrice });
    displayProducts();
    nameInput.value = '';
    priceInput.value = '';
    saveProducts();
}

function editProduct(productId) {
    const productName = prompt("Enter new product name", products.find(p => p.id === productId).name);
    const productPrice = prompt("Enter new product price", products.find(p => p.id === productId).price);

    if (!productName || isNaN(productPrice)) {
        return alert("Invalid product name or price");
    }
    
    const productIndex = products.findIndex(p => p.id === productId);
    products[productIndex] = { ...products[productIndex], name: productName, price: parseFloat(productPrice) };
    displayProducts();
    saveProducts();
}

function deleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    products = products.filter(p => p.id !== productId);
    displayProducts();
    saveProducts();
}