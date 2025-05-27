document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const orderButton = document.getElementById('orderButton'); // Botón "Pide Aquí" del hero
    const baseSelect1 = document.getElementById('baseSelect1');
    const baseSelect2 = document.getElementById('baseSelect2');
    const sizeSelect = document.getElementById('sizeSelect');
    // Se asegura de seleccionar todos los checkboxes de toppings correctamente
    const toppingsCheckboxes = document.querySelectorAll('.option-group input[type="checkbox"]');
    const customSummary = document.getElementById('customSummary');
    const granizadaPriceElement = document.getElementById('granizadaPrice');
    const addToCartButton = document.getElementById('addToCartButton'); // Nuevo botón para añadir al carrito

    const cartItemsContainer = document.getElementById('cartItems'); // Contenedor de elementos del carrito
    const cartTotalPriceElement = document.getElementById('cartTotalPrice'); // Total del carrito
    const clearCartButton = document.getElementById('clearCartButton'); // Botón para vaciar carrito
    const placeOrderWhatsAppButton = document.getElementById('placeOrderWhatsApp'); // Botón para hacer pedido por WhatsApp

    // --- Variables de Precios ---
    const BASE_PRICES = {
        '12oz': 10,
        '16oz': 12
    };
    const TOPPING_PRICE = 2; // Q2 por cada topping adicional

    // --- Carrito de Compras (Array) ---
    let cart = []; // Array para almacenar las granizadas en el carrito

    // --- Funciones de Utilidad ---

    // Smooth scrolling para la navegación (ahora solo un enlace)
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Redireccionar el botón "Pide Aquí" a la sección de personalización
    if (orderButton) {
        orderButton.addEventListener('click', () => {
            window.location.href = '#personaliza';
        });
    }

    /**
     * Actualiza el estado del selector del Sabor 2 (deshabilita para Salada/Hawaiiana).
     * También resetea su valor a 'ninguna' si se deshabilita.
     */
    function updateSecondBaseAvailability() {
        const selectedBase1 = baseSelect1.value;
        // Si Sabor 1 es 'salada' o 'hawaiiana', deshabilita Sabor 2
        const disableSecondBase = (selectedBase1 === 'salada' || selectedBase1 === 'hawaiiana');

        baseSelect2.disabled = disableSecondBase;
        if (disableSecondBase) {
            baseSelect2.value = 'ninguna'; // Resetea el Sabor 2 si se deshabilita
            baseSelect2.style.backgroundColor = '#e9e9e9'; // Estilo para indicar que está deshabilitado
            baseSelect2.style.cursor = 'not-allowed';
        } else {
            baseSelect2.style.backgroundColor = '#fefefe'; // Restaura el estilo si está habilitado
            baseSelect2.style.cursor = 'pointer';
        }
    }

    /**
     * Calcula el precio de la granizada actual y actualiza el resumen en el DOM.
     */
    function updateCurrentGranizadaSummaryAndPrice() {
        const selectedBase1 = baseSelect1.value;
        // Solo considera el valor de baseSelect2 si no está deshabilitado
        const selectedBase2 = baseSelect2.disabled ? 'ninguna' : baseSelect2.value;
        const selectedSize = sizeSelect.value;

        let currentToppings = [];
        let numSelectedToppings = 0;
        toppingsCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                currentToppings.push(checkbox.value);
                numSelectedToppings++;
            }
        });

        let currentGranizadaPrice = BASE_PRICES[selectedSize] + (numSelectedToppings * TOPPING_PRICE);

        // Se corrigió el uso de `**` para negritas en JavaScript, es mejor usar CSS o evitarlo si es solo para el resumen visual.
        // Aquí se eliminó `**` para evitar que aparezca como texto en el resumen, si lo quieres negrita, hazlo con CSS.
        let summaryText = `${selectedBase1.charAt(0).toUpperCase() + selectedBase1.slice(1)}`;
        if (selectedBase2 !== 'ninguna') { // Si Sabor 2 no es "ninguna" y no está deshabilitado
            summaryText += ` y ${selectedBase2.charAt(0).toUpperCase() + selectedBase2.slice(1)}`;
        }
        summaryText += ` (${selectedSize})`;

        if (currentToppings.length > 0) {
            summaryText += ` con ${currentToppings.join(', ')}`;
        } else {
            summaryText += ` (sin toppings extras)`;
        }

        customSummary.textContent = summaryText; // Cambiado a textContent para evitar interpretar HTML
        granizadaPriceElement.textContent = `Q${currentGranizadaPrice.toFixed(2)}`;
    }

    // --- Funciones del Carrito ---

    /**
     * Renderiza los elementos del carrito en el HTML y actualiza el precio total.
     */
    function renderCart() {
        cartItemsContainer.innerHTML = ''; // Limpiar el contenido actual
        let totalCartPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                itemDiv.dataset.index = index; // Para identificar el elemento al eliminar

                itemDiv.innerHTML = `
                    <div class="item-details">
                        ${item.summary} <span class="price"> - Q${item.price.toFixed(2)}</span>
                    </div>
                    <button class="remove-item-button">Eliminar</button>
                `;
                cartItemsContainer.appendChild(itemDiv);
                totalCartPrice += item.price;
            });
        }

        cartTotalPriceElement.textContent = `Q${totalCartPrice.toFixed(2)}`;
    }

    /**
     * Añade la granizada personalizada actualmente seleccionada al carrito.
     */
    function addCurrentGranizadaToCart() {
        const selectedBase1 = baseSelect1.value;
        // Importante: Capturar el valor de Sabor 2 considerando si está deshabilitado
        const selectedBase2 = baseSelect2.disabled ? 'ninguna' : baseSelect2.value;
        const selectedSize = sizeSelect.value;
        let currentToppings = [];
        let numSelectedToppings = 0;

        toppingsCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                currentToppings.push(checkbox.value);
                numSelectedToppings++;
            }
        });

        const granizadaPrice = BASE_PRICES[selectedSize] + (numSelectedToppings * TOPPING_PRICE);

        let granizadaSummary = `${selectedBase1.charAt(0).toUpperCase() + selectedBase1.slice(1)}`;
        if (selectedBase2 !== 'ninguna') {
            granizadaSummary += ` y ${selectedBase2.charAt(0).toUpperCase() + selectedBase2.slice(1)}`;
        }
        granizadaSummary += ` (${selectedSize})`;

        if (currentToppings.length > 0) {
            granizadaSummary += ` con ${currentToppings.join(', ')}`;
        }

        // Añadir al carrito
        cart.push({
            summary: granizadaSummary,
            price: granizadaPrice,
            details: { // Guarda los detalles completos para el mensaje de WhatsApp
                base1: selectedBase1,
                base2: selectedBase2, // Guardar el valor real, incluso si es 'ninguna' por deshabilitación
                size: selectedSize,
                toppings: currentToppings
            }
        });

        renderCart(); // Actualizar la vista del carrito
        alert('Granizada añadida al carrito!'); // Feedback al usuario

        // Opcional: Reiniciar la selección de la granizada actual para que el usuario pueda crear otra
        resetGranizadaBuilder();
    }

    /**
     * Resetea los selectores y checkboxes de la sección de personalización a sus valores por defecto.
     */
    function resetGranizadaBuilder() {
        baseSelect1.value = 'mora';
        baseSelect2.value = 'ninguna';
        sizeSelect.value = '12oz';
        toppingsCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        updateSecondBaseAvailability(); // Asegura que el estado de la segunda base se reinicie correctamente
        updateCurrentGranizadaSummaryAndPrice(); // Actualiza el resumen y precio
    }

    /**
     * Elimina un elemento del carrito por su índice.
     * @param {number} index El índice del elemento a eliminar.
     */
    function removeItemFromCart(index) {
        cart.splice(index, 1); // Elimina 1 elemento desde el índice dado
        renderCart(); // Volver a renderizar el carrito
    }

    /**
     * Vacía todo el carrito después de la confirmación del usuario.
     */
    function clearCart() {
        if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
            cart = []; // Vacía el array
            renderCart(); // Actualiza la vista
            alert('Carrito vaciado.');
        }
    }

    /**
     * Genera un mensaje de pedido detallado y lo envía por WhatsApp.
     */
    function placeOrderViaWhatsApp() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Por favor, añade algunas granizadas antes de hacer un pedido.');
            return;
        }

        let orderMessage = `¡Hola! Me gustaría hacer el siguiente pedido de Granizadas Eugenias:\n\n`;
        let totalOrderPrice = 0;

        cart.forEach((item, index) => {
            orderMessage += `Granizada #${index + 1}:\n`;
            orderMessage += `  Sabor 1: ${item.details.base1.charAt(0).toUpperCase() + item.details.base1.slice(1)}\n`;
            if (item.details.base2 !== 'ninguna') { // Solo añadir Sabor 2 si no es 'ninguna'
                orderMessage += `  Sabor 2: ${item.details.base2.charAt(0).toUpperCase() + item.details.base2.slice(1)}\n`;
            }
            orderMessage += `  Tamaño: ${item.details.size}\n`;
            if (item.details.toppings.length > 0) {
                orderMessage += `  Toppings: ${item.details.toppings.join(', ')}\n`;
            } else {
                orderMessage += `  Sin toppings extras\n`;
            }
            orderMessage += `  Precio: Q${item.price.toFixed(2)}\n\n`;
            totalOrderPrice += item.price;
        });

        orderMessage += `Total del Pedido: Q${totalOrderPrice.toFixed(2)}\n\n`;
        orderMessage += `Por favor, confirma mi pedido. ¡Gracias!`;

        const whatsappLink = `https://wa.me/50236922955?text=${encodeURIComponent(orderMessage)}`;
        window.open(whatsappLink, '_blank');

        // Opcional: Vaciar el carrito después de enviar el pedido
        // cart = [];
        // renderCart();
    }


    // --- Event Listeners ---

    // Personalización de la granizada actual
    baseSelect1.addEventListener('change', () => {
        updateSecondBaseAvailability();
        updateCurrentGranizadaSummaryAndPrice();
    });
    baseSelect2.addEventListener('change', updateCurrentGranizadaSummaryAndPrice);
    sizeSelect.addEventListener('change', updateCurrentGranizadaSummaryAndPrice);
    toppingsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCurrentGranizadaSummaryAndPrice);
    });

    // Botón "Añadir al Carrito"
    addToCartButton.addEventListener('click', addCurrentGranizadaToCart);

    // Botones del Carrito
    clearCartButton.addEventListener('click', clearCart);
    placeOrderWhatsAppButton.addEventListener('click', placeOrderViaWhatsApp);

    // Event listener para eliminar ítems individuales del carrito (delegación de eventos)
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-button')) {
            const itemDiv = event.target.closest('.cart-item');
            const index = parseInt(itemDiv.dataset.index);
            removeItemFromCart(index);
        }
    });

    // --- Inicialización al cargar la página ---
    updateSecondBaseAvailability(); // Asegura que la segunda base esté deshabilitada si aplica al cargar
    updateCurrentGranizadaSummaryAndPrice(); // Actualiza el resumen inicial
    renderCart(); // Muestra el carrito vacío al inicio
});