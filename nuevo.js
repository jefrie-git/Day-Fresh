import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Mostrar campo adicional si se selecciona 'Otro'
const productoSelect = document.getElementById('producto');
const nuevoProductoContainer = document.getElementById('nuevoProductoContainer');

productoSelect.addEventListener('change', () => {
    if (productoSelect.value === 'Otro') {
        nuevoProductoContainer.style.display = 'block'; // Mostrar el campo
    } else {
        nuevoProductoContainer.style.display = 'none'; // Ocultar el campo
    }
});

// Función para guardar un producto
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    let producto = document.getElementById('producto').value;
    const aroma = document.getElementById('aroma').value;
    const existencia = document.getElementById('existencia').value;
    const precio = document.getElementById('precio').value;
    const file = document.getElementById('inputFile').files[0];
    
    // Si se selecciona 'Otro', usar el valor del nuevo producto
    if (producto === 'Otro') {
        const nuevoProducto = document.getElementById('nuevoProducto').value;
        if (!nuevoProducto) {
            alert('Por favor, ingrese el nombre del nuevo producto.');
            return;
        }
        producto = nuevoProducto; // Sobrescribir con el nombre del nuevo producto
    }

    if (!producto || !existencia || !precio || !file) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    try {
        // Subir la imagen a Firebase Storage
        const storageRef = ref(storage, 'productos/' + file.name);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);

        // Guardar la información en Firestore
        await addDoc(collection(db, 'productos'), {
            producto,
            aroma,
            existencia,
            precio,
            imageUrl,
            createdAt: Timestamp.fromDate(new Date())
        });

        alert('Producto guardado exitosamente.');
        document.getElementById('productForm').reset();
        nuevoProductoContainer.style.display = 'none'; // Resetear el campo oculto
        loadProducts();
    } catch (e) {
        console.error('Error al guardar el producto: ', e);
        alert('Error al guardar el producto.');
    }
});

// Función para cargar productos desde Firestore y mostrarlos en la tabla
async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });
        renderProducts(products);
    } catch (e) {
        console.error('Error al cargar los productos: ', e);
    }
}

// Función para eliminar un producto de Firestore y su imagen de Firebase Storage
window.deleteProduct = async function(id, imageUrl) {
    const confirmation = confirm('¿Estás seguro de que deseas eliminar este producto?');
    
    if (!confirmation) {
        return; // Si el usuario cancela, detener la ejecución
    }

    try {
        // Eliminar el documento de Firestore
        await deleteDoc(doc(db, 'productos', id));

        // Eliminar la imagen de Firebase Storage
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);

        alert('Producto eliminado exitosamente.');
        loadProducts(); // Recargar productos después de eliminar
    } catch (e) {
        console.error('Error al eliminar el producto: ', e);
        alert('Hubo un error al eliminar el producto.');
    }
}

// Función para renderizar los productos en la tabla
function renderProducts(products) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    products.forEach((product) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.producto}</td>
            <td>${product.aroma}</td>
            <td>${product.existencia}</td>
            <td>${product.precio}</td>
            <td><img src="${product.imageUrl}" alt="${product.producto}" width="100"></td>
            <td><button class="btn btn-danger" onclick="deleteProduct('${product.id}', '${product.imageUrl}')">Eliminar</button></td>
        `;

        tableBody.appendChild(row);
    });
}

// Cargar productos al cargar la página
window.onload = loadProducts;
