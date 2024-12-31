let cart = JSON.parse(localStorage.getItem('productos')) || [];
let precio = parseFloat(localStorage.getItem('total')) || 0;

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    const button = card.querySelector('button');
    const productTitle = card.querySelector('h4').textContent;
    let productPriceText = card.querySelector('p:last-child').textContent;
    let productPrice = parseFloat(productPriceText.replace(/[$.-]/g, '').replace(/\./g, ''));

    button.addEventListener('click', () => {
        const existingProductIndex = cart.findIndex(item => item.title === productTitle);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].cantidad++;
        } else {
            const product = {
                title: productTitle,
                price: productPrice,
                cantidad: 1
            };
            cart.push(product);
        }

        precio = cart.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
        localStorage.setItem('productos', JSON.stringify(cart));
        localStorage.setItem('total', precio);
        updateCartCount();
        handleCart(); 
    });
});

function updateCartCount() {
    const cartCountElement = document.querySelector('.cantProduct');
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }
}

function handleCart() {
    const cart = JSON.parse(localStorage.getItem('productos')) || [];
    const total = parseFloat(localStorage.getItem('total')) || 0;
    const carritoContainer = document.getElementById('itemProducts');

    if (!carritoContainer) return;
    carritoContainer.innerHTML = '';

    if (cart.length === 0) {
        carritoContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
        return;
    }

    const tabla = document.createElement('table');
    tabla.classList.add('table');

    let encabezado = `
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Acciones</th> </tr>
        </thead>
        <tbody>
    `;

    let cuerpo = '';
    cart.forEach((producto, index) => { 
        const subtotal = producto.price * producto.cantidad;
        cuerpo += `
            <tr>
                <td>${producto.title}</td>
                <td>
                  <button class="quantity-btn minus" data-index="${index}">-</button>
                  ${producto.cantidad}
                  <button class="quantity-btn plus" data-index="${index}">+</button>
                </td>
                <td>$${producto.price.toLocaleString('es-AR')}</td>
                <td>$${subtotal.toLocaleString('es-AR')}</td>
        <td><button class="remove-btn" data-index="${index}">Eliminar</button></td>
            </tr>
        `;
    });

    cuerpo += '</tbody>';
    tabla.innerHTML = encabezado + cuerpo;
    carritoContainer.appendChild(tabla);

    let precioFinal = document.createElement('p');
    precioFinal.innerText = `Total a pagar: $${total.toLocaleString('es-AR')}`;
    carritoContainer.appendChild(precioFinal);

    const clearCartButton = document.createElement('button');
    clearCartButton.textContent = "Limpiar Carrito";
    clearCartButton.classList.add('button');
    clearCartButton.addEventListener('click', limpiarCarrito);
    carritoContainer.appendChild(clearCartButton);

    const quantityButtons = document.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });

    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });

    const buyButton = document.createElement('button');
    buyButton.textContent = "Comprar";
    buyButton.classList.add('button'); 
    buyButton.addEventListener('click', handleBuy);
    carritoContainer.appendChild(buyButton);
}

function handleQuantityChange(event) {
    const index = parseInt(event.target.dataset.index);
    const operation = event.target.classList.contains('plus') ? 1 : -1;

    if (cart[index].cantidad + operation > 0) {
      cart[index].cantidad += operation;
      precio = cart.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
      localStorage.setItem('productos', JSON.stringify(cart));
      localStorage.setItem('total', precio);
      handleCart();
    } else{
        handleRemoveItem(event)
    }
}

function handleRemoveItem(event) {
    const index = parseInt(event.target.dataset.index);
    cart.splice(index, 1); 
    precio = cart.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
    localStorage.setItem('productos', JSON.stringify(cart));
    localStorage.setItem('total', precio);
    updateCartCount();
    handleCart();
}

function handleBuy() {
    if (confirm("¿Estás seguro de que deseas realizar la compra?")) {
    cart = [];
    precio = 0;
    localStorage.removeItem('productos');
    localStorage.removeItem('total');
    updateCartCount();
    handleCart();
    alert("¡Gracias por su compra!"); 
    }
}

function limpiarCarrito() {
    if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
        cart = [];
        precio = 0;
        localStorage.removeItem('productos');
        localStorage.removeItem('total');
        updateCartCount();
        handleCart();
    }
}

if (document.getElementById('itemProducts')) {
    window.onload = handleCart;
}




