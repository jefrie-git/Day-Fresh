import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBD417f9drg_U_BCCJpS6aZIaN7S9o_LJw",
    authDomain: "pruevas-53538.firebaseapp.com",  
    projectId: "pruevas-53538",
    storageBucket: "pruevas-53538.appspot.com",
    messagingSenderId: "973518171189",
    appId: "1:973518171189:web:8e053f49f71824b6cd557c",
    measurementId: "G-TJDCSNRNPD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let products = [];

// Cargar productos desde Firebase
async function loadProductsFromFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        products = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            products.push({
                id: doc.id,
                name: data.producto,
                aroma: data.aroma,
                price: data.precio,
                stock: data.existencia,
                image: data.imageUrl || 'https://via.placeholder.com/150'
            });
        });
        renderProducts(products);
    } catch (e) {
        console.error('Error al cargar los productos de Firebase: ', e);
    }
}

// Renderizar los productos
function renderProducts(productsList) {
    const catalog = document.getElementById('catalog');
    catalog.innerHTML = ''; // Limpiar catálogo
    productsList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card'; // Clase para mantener el estilo

        const price = parseFloat(product.price); 
        const formattedPrice = isNaN(price) ? "Precio no disponible" : price.toFixed(2);

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name} - ${product.aroma}</h3>
            <p>Precio: Q${formattedPrice}</p>
            <p>Existencias: ${product.stock}</p>
            <button class="add-to-cart" data-product-id="${product.id}" data-product-stock="${product.stock}">Agregar al carrito</button>
        `;

        catalog.appendChild(productCard);
    });

    // Agregar evento de click al botón "Agregar al carrito"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productStock = parseInt(this.getAttribute('data-product-stock')); // Obtener existencias
            const product = products.find(p => p.id === productId);

            addToCart(product);
            // Restar 1 del stock del producto en el catálogo
            updateStock(productId, productStock - 1);
        });
    });
}

// Agregar producto al carrito
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} ha sido agregado al carrito`);
}

// Actualizar el stock del producto en Firebase
async function updateStock(productId, newStock) {
    const productRef = doc(db, 'productos', productId);
    await updateDoc(productRef, {
        existencias: newStock // Actualiza las existencias
    });
}

// Filtrar productos
function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchInput)
    );
    renderProducts(filteredProducts);
}

document.getElementById('searchInput').addEventListener('input', filterProducts);

loadProductsFromFirebase();
