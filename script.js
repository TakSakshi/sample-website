// ============================================
// CONFIGURATION
// ============================================

const WEBSITE_CONFIG = {
    name: "Electric Buddy",
    tagline: "Your One-Stop Shopping Destination",
    email: "contact@shophub.com",
    phone: "+91 1234567890",
    address: "123 Shopping Street, Delhi, India"
};

const PRODUCTS = [
    { id: 1, name: "Wireless Headphones", price: 2999, image: "https://images.pexels.com/photos/682933/pexels-photo-682933.jpeg", category: "Electronics" },
    { id: 2, name: "Smart Watch Series 5", price: 4499, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", category: "Electronics" },
    { id: 3, name: "Running Shoes", price: 1799, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", category: "Fashion" },
    { id: 4, name: "Polarized Sunglasses", price: 899, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", category: "Accessories" },
    { id: 5, name: "Leather Backpack", price: 2499, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", category: "Accessories" },
    { id: 6, name: "Denim Jacket", price: 3299, image: "https://images.unsplash.com/photo-1551534769-b0de875337b3?w=500", category: "Fashion" },
    { id: 7, name: "Gaming Mouse", price: 1299, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500", category: "Electronics" },
    { id: 8, name: "Mechanical Keyboard", price: 5999, image: "https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=500", category: "Electronics" },
    { id: 9, name: "Cotton T-Shirt", price: 499, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", category: "Fashion" },
    { id: 10, name: "Analog Wristwatch", price: 3599, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500", category: "Accessories" },
    { id: 11, name: "Yoga Mat", price: 699, image: "https://images.unsplash.com/photo-1592432678010-c5914c894053?w=500", category: "Fitness" },
    { id: 12, name: "Water Bottle", price: 399, image: "https://images.unsplash.com/photo-1602143407151-011141950038?w=500", category: "Fitness" }
];

const HERO_IMAGE = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop";

// ============================================
// GLOBAL STATE
// ============================================

let cartItems = [];
let isLoggedIn = false;
let isDarkMode = false;
let currentChatOption = '';

// ============================================
// INITIALIZE APP
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    checkAuthStatus();
    loadTheme();
    showPage('home');
});

function initializeWebsite() {
    document.getElementById('siteName').textContent = WEBSITE_CONFIG.name;
    document.getElementById('footerName').textContent = WEBSITE_CONFIG.name;
    document.getElementById('footerCopyright').textContent = WEBSITE_CONFIG.name;
}

// ============================================
// NAVIGATION
// ============================================

function showPage(page) {
    const mainContent = document.getElementById('mainContent');
    
    switch(page) {
        case 'home':
            mainContent.innerHTML = renderHomePage();
            setupSearchListener();
            break;
        case 'about':
            mainContent.innerHTML = renderAboutPage();
            break;
        case 'contact':
            mainContent.innerHTML = renderContactPage();
            break;
        case 'login':
            mainContent.innerHTML = renderLoginPage();
            break;
        case 'signup':
            mainContent.innerHTML = renderSignupPage();
            break;
        case 'cart':
            mainContent.innerHTML = renderCartPage();
            break;
        case 'checkout':
            if(cartItems.length === 0) {
                alert("Cart is empty!");
                showPage('home');
            } else if (!isLoggedIn) {
                alert("Please login to checkout");
                showPage('login');
            } else {
                mainContent.innerHTML = renderCheckoutPage();
            }
            break;
        default:
            mainContent.innerHTML = renderHomePage();
    }
    window.scrollTo(0, 0);
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
}

// ============================================
// PAGE RENDERERS
// ============================================

function renderHomePage() {
    return `
        <section class="relative h-96 bg-cover bg-center" style="background-image: url('${HERO_IMAGE}')">
            <div class="hero-overlay absolute inset-0 flex items-center justify-center">
                <div class="text-center text-white px-4 fade-in">
                    <h1 class="text-5xl font-bold mb-4">${WEBSITE_CONFIG.name}</h1>
                    <p class="text-xl mb-8">${WEBSITE_CONFIG.tagline}</p>
                    <button onclick="document.getElementById('productSection').scrollIntoView({behavior: 'smooth'})" class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors shadow-lg">
                        Shop Now
                    </button>
                </div>
            </div>
        </section>

        <section id="productSection" class="max-w-7xl mx-auto px-4 py-16">
            <h2 class="text-3xl font-bold text-center mb-12 dark:text-white">Our Products</h2>
            <div id="productGrid" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                ${generateProductHTML(PRODUCTS)}
            </div>
        </section>
    `;
}

function generateProductHTML(products) {
    if (products.length === 0) return '<p class="text-center col-span-full dark:text-white">No products found.</p>';
    return products.map(product => `
        <div class="product-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border dark:border-gray-700">
            <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
            <div class="p-6">
                <span class="text-sm text-gray-500 dark:text-gray-400">${product.category}</span>
                <h3 class="text-xl font-semibold mt-2 mb-3 dark:text-white">${product.name}</h3>
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-bold text-blue-600">₹${product.price}</span>
                    <button onclick="addToCart(${product.id})" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// RESTORED DETAILED CONTACT PAGE
function renderContactPage() {
    return `
        <div class="max-w-6xl mx-auto px-4 py-16 fade-in dark:text-white">
            <h1 class="text-4xl font-bold text-center mb-12">Contact Us</h1>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border dark:border-gray-700">
                    <h2 class="text-2xl font-semibold mb-6">Send us a Message</h2>
                    <form onsubmit="alert('Thank you for contacting us! We will get back to you soon.'); event.target.reset(); return false;">
                        <div class="mb-4">
                            <label class="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
                            <input type="text" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600" required>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                            <input type="email" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600" required>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
                            <textarea rows="5" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600" required></textarea>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                            Send Message
                        </button>
                    </form>
                </div>

                <div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 border dark:border-gray-700">
                        <h2 class="text-2xl font-semibold mb-6">Get in Touch</h2>
                        <div class="space-y-4">
                            <div class="flex items-start">
                                <svg class="w-6 h-6 text-blue-600 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <div>
                                    <h3 class="font-semibold">Email</h3>
                                    <p class="text-gray-600 dark:text-gray-400">${WEBSITE_CONFIG.email}</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <svg class="w-6 h-6 text-blue-600 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                <div>
                                    <h3 class="font-semibold">Phone</h3>
                                    <p class="text-gray-600 dark:text-gray-400">${WEBSITE_CONFIG.phone}</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <svg class="w-6 h-6 text-blue-600 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                <div>
                                    <h3 class="font-semibold">Address</h3>
                                    <p class="text-gray-600 dark:text-gray-400">${WEBSITE_CONFIG.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-blue-50 dark:bg-gray-700 rounded-lg p-8 border dark:border-gray-600">
                        <h3 class="text-xl font-semibold mb-4">Business Hours</h3>
                        <div class="space-y-2 text-gray-700 dark:text-gray-300">
                            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                            <p>Saturday: 10:00 AM - 4:00 PM</p>
                            <p>Sunday: Closed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ... (renderCartPage, renderCheckoutPage, renderLoginPage, renderAboutPage, renderSignupPage remain same as previous version) ...
// For brevity, I am not re-pasting them, but they MUST be included in your final file. 
// If you are copying this fresh, copy the functions from the PREVIOUS response and paste them here, 
// OR just use the handlers below which is what you specifically requested.

function renderCartPage() {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    if (cartItems.length === 0) {
        return `
            <div class="max-w-7xl mx-auto px-4 py-16 text-center fade-in">
                <h2 class="text-3xl font-bold mb-4 dark:text-white">Your Cart is Empty</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
                <button onclick="showPage('home')" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">Continue Shopping</button>
            </div>
        `;
    }
    return `
        <div class="max-w-4xl mx-auto px-4 py-16 fade-in">
            <h1 class="text-3xl font-bold mb-8 dark:text-white">Shopping Cart</h1>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div class="p-6">
                    ${cartItems.map((item, index) => `
                        <div class="flex items-center justify-between py-4 border-b dark:border-gray-700">
                            <div class="flex items-center">
                                <img src="${item.image}" class="w-16 h-16 object-cover rounded mr-4">
                                <div>
                                    <h3 class="font-semibold dark:text-white">${item.name}</h3>
                                    <p class="text-gray-500 dark:text-gray-400">₹${item.price}</p>
                                </div>
                            </div>
                            <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 font-medium">Remove</button>
                        </div>
                    `).join('')}
                    <div class="mt-8 flex justify-between items-center pt-4 border-t dark:border-gray-700">
                        <span class="text-xl font-bold dark:text-white">Total:</span>
                        <span class="text-2xl font-bold text-blue-600">₹${total}</span>
                    </div>
                    <div class="mt-8 flex justify-end space-x-4">
                        <button onclick="showPage('home')" class="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700">Continue Shopping</button>
                        <button onclick="showPage('checkout')" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg">Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderCheckoutPage() {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    return `
        <div class="max-w-2xl mx-auto px-4 py-16 fade-in">
            <h1 class="text-3xl font-bold mb-8 text-center dark:text-white">Checkout</h1>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                <div class="mb-6 pb-6 border-b dark:border-gray-700">
                    <h3 class="text-lg font-semibold mb-2 dark:text-white">Order Summary</h3>
                    <div class="flex justify-between dark:text-gray-300">
                        <span>Items (${cartItems.length})</span>
                        <span>₹${total}</span>
                    </div>
                    <div class="flex justify-between font-bold text-xl mt-4 dark:text-white">
                        <span>Total</span>
                        <span>₹${total}</span>
                    </div>
                </div>
                <form onsubmit="handleCheckout(event)">
                    <h3 class="text-lg font-semibold mb-4 dark:text-white">Shipping Details</h3>
                    <div class="grid grid-cols-1 gap-4 mb-6">
                        <input type="text" placeholder="Full Name" required class="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <input type="text" placeholder="Address" required class="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <div class="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="City" required class="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <input type="text" placeholder="ZIP Code" required class="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        </div>
                    </div>
                    <button type="submit" class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg shadow-md">
                        Place Order (₹${total})
                    </button>
                </form>
            </div>
        </div>
    `;
}

function renderLoginPage() {
    return `
        <div class="min-h-screen flex items-center justify-center px-4 py-16 fade-in">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
                <h1 class="text-3xl font-bold dark:text-white text-center mb-8">Welcome Back</h1>
                <form onsubmit="handleLogin(event)">
                    <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <input type="email" class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
                        <input type="password" class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold mb-4">Login</button>
                </form>
                <div class="text-center">
                    <button onclick="showPage('signup')" class="text-blue-600 hover:underline">Create Account</button>
                </div>
            </div>
        </div>
    `;
}

function renderSignupPage() {
    return renderLoginPage().replace('Login', 'Sign Up').replace('Welcome Back', 'Create Account').replace('handleLogin', 'handleSignup');
}

function renderAboutPage() {
    return `
        <div class="max-w-4xl mx-auto px-4 py-16 fade-in dark:text-white">
            <h1 class="text-4xl font-bold text-center mb-8">About Us</h1>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">We are ${WEBSITE_CONFIG.name}, providing the best products since 2024.</p>
                <div class="grid grid-cols-3 gap-4 text-center mt-8">
                    <div class="p-4 bg-blue-50 dark:bg-gray-700 rounded">
                        <h3 class="text-2xl font-bold text-blue-600">12+</h3>
                        <p class="text-gray-600 dark:text-gray-300">Products</p>
                    </div>
                    <div class="p-4 bg-blue-50 dark:bg-gray-700 rounded">
                        <h3 class="text-2xl font-bold text-blue-600">5k+</h3>
                        <p class="text-gray-600 dark:text-gray-300">Sales</p>
                    </div>
                    <div class="p-4 bg-blue-50 dark:bg-gray-700 rounded">
                        <h3 class="text-2xl font-bold text-blue-600">4.9</h3>
                        <p class="text-gray-600 dark:text-gray-300">Rating</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// LOGIC HANDLERS
// ============================================

function handleSearch() {
    const desktopInput = document.getElementById('searchInput');
    const mobileInput = document.getElementById('mobileSearchInput');
    const query = (desktopInput.value || mobileInput.value || "").toLowerCase();
    
    if(!document.getElementById('productSection')) {
        showPage('home');
    }
    
    const filtered = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
    );
    
    const grid = document.getElementById('productGrid');
    if(grid) grid.innerHTML = generateProductHTML(filtered);
    
    if(document.getElementById('productSection')) {
        document.getElementById('productSection').scrollIntoView({ behavior: 'smooth' });
    }
}

function setupSearchListener() {
    const input = document.getElementById('searchInput');
    if(input) {
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
}

function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    cartItems.push(product);
    updateCartCount();
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Added!";
    btn.classList.add('bg-green-600');
    setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove('bg-green-600');
    }, 1000);
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCartCount();
    showPage('cart');
}

function updateCartCount() {
    const el = document.getElementById('cartCount');
    el.textContent = cartItems.length;
    el.classList.toggle('hidden', cartItems.length === 0);
}

function handleLogin(e) {
    e.preventDefault();
    isLoggedIn = true;
    checkAuthStatus();
    showPage('home');
}

function handleSignup(e) {
    e.preventDefault();
    alert("Account created!");
    showPage('login');
}

function logout() {
    isLoggedIn = false;
    checkAuthStatus();
    showPage('home');
}

function checkAuthStatus() {
    const loginBtn = document.getElementById('loginBtn');
    const profile = document.getElementById('userProfile');
    const mobileLogin = document.getElementById('mobileLoginBtn');
    
    if (isLoggedIn) {
        loginBtn.classList.add('hidden');
        profile.classList.remove('hidden');
        if(mobileLogin) mobileLogin.textContent = "Logout";
        if(mobileLogin) mobileLogin.onclick = () => { logout(); toggleMobileMenu(); };
    } else {
        loginBtn.classList.remove('hidden');
        profile.classList.add('hidden');
        if(mobileLogin) mobileLogin.textContent = "Login";
        if(mobileLogin) mobileLogin.onclick = () => { showPage('login'); toggleMobileMenu(); };
    }
}

function handleCheckout(e) {
    e.preventDefault();
    alert(`Order Placed Successfully! Total: ₹${cartItems.reduce((s,i)=>s+i.price,0)}`);
    cartItems = [];
    updateCartCount();
    showPage('home');
}

// ============================================
// CHATBOT LOGIC (RESTORED)
// ============================================

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('hidden');
}

function selectChatOption(option) {
    currentChatOption = option;
    document.getElementById('chatOptions').classList.add('hidden');
    document.getElementById('chatForm').classList.remove('hidden');
    document.getElementById('formTitle').textContent = option.replace('query', 'Product Query').replace('feedback', 'Feedback').replace('support', 'Support Request');
}

function backToOptions() {
    document.getElementById('chatOptions').classList.remove('hidden');
    document.getElementById('chatForm').classList.add('hidden');
    currentChatOption = '';
    document.getElementById('chatName').value = '';
    document.getElementById('chatEmail').value = '';
    document.getElementById('chatMessage').value = '';
}

function submitChatForm(e) {
    e.preventDefault();
    const name = document.getElementById('chatName').value;
    
    // THE SPECIFIC ALERT MESSAGE YOU REQUESTED
    alert(`Thank you ${name}! Your query has been noted. Our team will contact you shortly.`);
    
    backToOptions();
    toggleChat();
}

// ============================================
// DARK MODE
// ============================================

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    const html = document.documentElement;
    if (isDarkMode) {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDarkMode = true;
        document.documentElement.classList.add('dark');
    } else {
        isDarkMode = false;
        document.documentElement.classList.remove('dark');
    }
}
