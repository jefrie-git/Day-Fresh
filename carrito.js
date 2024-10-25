// Cargar productos del localStorage
function loadCartItems() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderCart(cart);
}

// Renderizar los productos en el carrito
function renderCart(cart) {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = ''; // Limpiar carrito
    let total = 0;

    cart.forEach((product, index) => {
        const productPrice = parseFloat(product.price);
        const formattedPrice = isNaN(productPrice) ? "Precio no disponible" : productPrice.toFixed(2);
        total += productPrice;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item d-flex justify-content-between align-items-center mb-3';
        cartItem.innerHTML = `
            <div>
                <img src="${product.image}" alt="${product.name}" class="img-fluid" style="width: 100px; height: 100px; object-fit: cover;">
                <h4>${product.name}</h4>
                <p>Precio: Q${formattedPrice}</p>
            </div>
            <button class="btn btn-danger remove-item" data-index="${index}">Eliminar</button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    // Obtener la dirección seleccionada
    const direccionSelect = document.getElementById('selectDireccion');
    const selectedDireccion = direccionSelect.value;

    // Verificar que una dirección esté seleccionada
    if (!selectedDireccion) {
        alert('Por favor selecciona una dirección de entrega.');
        return;
    }

    // Calcular el costo de envío y el total
    let shippingCost = calculateShippingCost(selectedDireccion);
    let totalWithShipping = total + shippingCost;

    // Si el total es 150 o más, se descuenta el costo de envío
    if (total >= 150) {
        shippingCost = 0;
        totalWithShipping = total; // Solo el precio de los productos
    }

    document.getElementById('totalPrice').textContent = totalWithShipping.toFixed(2);

    // Agregar funcionalidad para eliminar producto
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
}

// Calcular el costo de envío según la dirección seleccionada
function calculateShippingCost(direccion) {
    const shippingPrices = {
        "Almolonga": 20,
        "Pologua": 25,
        "Cajolá": 25,
        "Cantel": 20,
        "Totonicapan": 25,
        "Sancristobal": 20,
        "Concepción Chiquirichapa": 20,
        "San Mateo": 20,
        "La Esperanza": 20,
        "Olintepeque": 20,
        "Palestina de Los Altos": 30,
        "Quetzaltenango": 15,
        "Salcajá": 20,
        "San Carlos Sija": 25,
        "San Francisco La Unión": 30,
        "San Francisco El Alto": 25,
        "San Juan Ostuncalco": 25,
        "Zunil": 20,
        "San Marcos": 60
    };
    return shippingPrices[direccion] || 0; // Retorna 0 si no se selecciona una dirección válida
}

// Escuchar el cambio de la dirección y actualizar el total
document.getElementById('selectDireccion').addEventListener('change', loadCartItems);

// Eliminar producto del carrito
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
}

// Vaciar carrito
document.getElementById('clearCart').addEventListener('click', () => {
    localStorage.removeItem('cart');
    loadCartItems();
});

// Hacer pedido
document.getElementById('makeOrder').addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }

    const direccionSelect = document.getElementById('selectDireccion');
    const selectedDireccion = direccionSelect.value;
    if (!selectedDireccion) {
        alert('Por favor selecciona una dirección de entrega.');
        return;
    }

    // Mostrar alertas de confirmación antes de enviar el pedido
    alert('Gracias por tu pedido.');
    alert('Cualquier duda consultar al WhatsApp.');

    // Crear mensaje para enviar a WhatsApp
    let mensaje = 'Hola, me gustaría hacer el siguiente pedido:\n\n';
    cart.forEach((product) => {
        mensaje += `Producto: ${product.name}\nPrecio: Q${product.price}\n\n`;
    });
    const total = document.getElementById('totalPrice').textContent;
    mensaje += `Total: Q${total}\nDirección de entrega: ${selectedDireccion}`;

    const numeroTelefono = "+40790247"; // Cambia este número por el de tu negocio
    const url = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
});

// Cargar productos cuando la página se carga
document.addEventListener('DOMContentLoaded', loadCartItems);
