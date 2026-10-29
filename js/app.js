
import { fetchProducts } from "./api.js";

// Product elements
const productList = document.getElementById("productList");
const loading = document.getElementById("loading");
const errorBanner = document.getElementById("errorBanner");
const searchInput = document.getElementById("searchInput");
const categoryTabs = document.getElementById("categoryTabs");
const sortSelect = document.getElementById("sortSelect");
const emptyMessage = document.getElementById("emptyMessage");

// Cart elements
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");

let products = [];
let selectedCategory = "all";
let cart = [];

const CART_KEY = "dynamicProductCart";

// Restore cart from localStorage
try {
    const savedCart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item =>
            Number.isInteger(item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
    }
} catch (error) {
    console.error("Could not restore cart:", error);
    cart = [];
}

function saveCart() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error("Could not save cart:", error);
        alert("Cart could not be saved in this browser.");
    }
}

// Display products
function displayProducts(items) {
    productList.innerHTML = "";
    emptyMessage.hidden = items.length !== 0;

    items.forEach(function (product) {
        const card = document.createElement("div");
        card.className = "product-card";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.title;
        image.loading = "lazy";

        const title = document.createElement("h3");
        title.textContent = product.title;

        const category = document.createElement("p");
        category.className = "category";
        category.textContent = product.category;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = "$" + product.price.toFixed(2);

        const button = document.createElement("button");
        button.className = "add-to-cart";
        button.textContent = "Add to Cart";
        button.dataset.productId = product.id;

        card.append(image, title, category, price, button);
        productList.appendChild(card);
    });
}

// Search, category filtering and sorting
function applyFilters() {
    let filteredProducts = products.filter(function (product) {
        const searchText = searchInput.value
            .toLowerCase()
            .trim();

        const matchesSearch =
            product.title.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (sortSelect.value === "low-high") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === "high-low") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(filteredProducts);
}

// Create category buttons
function createCategoryTabs() {
    const categories = [
        "all",
        ...new Set(products.map(product => product.category))
    ];

    categoryTabs.innerHTML = "";

    categories.forEach(function (category) {
        const button = document.createElement("button");

        button.className = "category-btn";
        button.textContent =
            category === "all" ? "All" : category;

        if (category === selectedCategory) {
            button.classList.add("active");
        }

        button.addEventListener("click", function () {
            selectedCategory = category;

            document.querySelectorAll(".category-btn")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");
            applyFilters();
        });

        categoryTabs.appendChild(button);
    });
}

// Open and close cart
function openCart() {
    cartPanel.classList.add("open");
    cartOverlay.hidden = false;
    cartPanel.removeAttribute("inert");
    cartPanel.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");
    closeCart.focus();
}

function hideCart() {
    cartPanel.classList.remove("open");
    cartOverlay.hidden = true;
    cartPanel.setAttribute("inert", "");
    cartPanel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
    cartToggle.focus();
}

cartToggle.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);
cartOverlay.addEventListener("click", hideCart);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && cartPanel.classList.contains("open")) {
        hideCart();
    }
});

// Add product to cart
productList.addEventListener("click", function (event) {
    const button = event.target.closest(".add-to-cart");

    if (!button) return;

    const productId = Number(button.dataset.productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart();
    renderCart();

    button.textContent = "Added!";
    setTimeout(() => {
        button.textContent = "Add to Cart";
    }, 800);
});

// Display cart items and total
function renderCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach(function (item) {
        const product = products.find(p => p.id === item.id);

        if (!product) return;

        total += product.price * item.quantity;
        count += item.quantity;

        const row = document.createElement("div");
        row.className = "cart-item";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.title;

        const details = document.createElement("div");
        details.className = "cart-item-details";

        const title = document.createElement("h4");
        title.textContent = product.title;

        const price = document.createElement("p");
        price.textContent =
            "$" + (product.price * item.quantity).toFixed(2);

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.setAttribute("aria-label", "Decrease quantity");
        minus.dataset.action = "decrease";
        minus.dataset.id = item.id;

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.setAttribute("aria-label", "Increase quantity");
        plus.dataset.action = "increase";
        plus.dataset.id = item.id;

        controls.append(minus, quantity, plus);

        const remove = document.createElement("button");
        remove.className = "remove-item";
        remove.textContent = "Remove";
        remove.dataset.action = "remove";
        remove.dataset.id = item.id;

        details.append(title, price, controls, remove);
        row.append(image, details);
        cartItems.appendChild(row);
    });

    cartCount.textContent = count;
    cartTotal.textContent = total.toFixed(2);
}

// Change quantity or remove an item
cartItems.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const productId = Number(button.dataset.id);
    const item = cart.find(item => item.id === productId);

    if (!item) return;

    if (button.dataset.action === "increase") {
        item.quantity++;
    } else if (button.dataset.action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    } else if (button.dataset.action === "remove") {
        cart = cart.filter(item => item.id !== productId);
    }

    saveCart();
    renderCart();
});

// Clear all cart items
clearCart.addEventListener("click", function () {
    cart = [];
    saveCart();
    renderCart();
});

// Fetch products from API
async function loadProducts() {
    loading.hidden = false;
    errorBanner.hidden = true;

    try {
        products = await fetchProducts();

        createCategoryTabs();
        applyFilters();
        renderCart();
    } catch (error) {
        errorBanner.hidden = false;
        console.error("Error loading products:", error);
    } finally {
        loading.hidden = true;
    }
}

searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);

document.getElementById("retryBtn")
    .addEventListener("click", loadProducts);

loadProducts();
