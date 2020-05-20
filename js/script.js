let products = [
    {
        name: 'WoodenDude',
        tag: 'wooden_dude',
        price: 15,
        inCart: 0,
    },
    {
        name: 'SpiralVase',
        tag: 'spiral_vase',
        price: 8,
        inCart: 0,
    },
    {
        name: 'Molecule',
        tag: 'molecule',
        price: 18,
        inCart: 0,
    },
    {
        name: 'SpiderRobot',
        tag: 'spider_robot',
        price: 21,
        inCart: 0,
    }
]

function onLoadCartNumbers() {
    console.log("Starting App");
    displayCart();

    let carts = document.querySelectorAll('.add-to-cart');

    for (let i = 0; i < carts.length; i++) {
        carts[i].addEventListener('click', function () {
            cartNumbers(products[i]);
            calculatePrice(products[i]);
        })
    }

    let productNumbers = localStorage.getItem('cartNumbers');

    if (productNumbers) {
        document.querySelector('.cart-btn span').textContent = productNumbers;
    }

}

function cartNumbers(product) {

    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart-btn span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart-btn span').textContent = 1;
    }

    setItems(product)
}

function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart')
    cartItems = JSON.parse(cartItems);

    if (cartItems != null) {
        if (cartItems[product.name] == undefined) {
            cartItems = {
                ...cartItems,
                [product.name]: product
            }
        }
        cartItems[product.name].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems = {
            [product.name]: product
        }
    }

    let productNames = Object.getOwnPropertyNames(cartItems);
    console.clear();
    console.log('Added:', cartItems[product.name].name);

    console.log('Cart:');

    for (let i = 0; i < Object.keys(cartItems).length; i++) {
        console.log(`${i + 1}. ${productNames[i]} - $${cartItems[productNames[i]].price}.00: ${cartItems[productNames[i]].inCart} pcs`);
    }

    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function calculatePrice(product) {

    let cartCost = localStorage.getItem("totalCost");

    if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost + product.price)
    } else {
        localStorage.setItem("totalCost", product.price)
    }

    displayCart();

}

function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector('.products-container');
    let cartContainer = document.querySelector('.cart-container');
    let totalCost = localStorage.getItem("totalCost");
    console.log('Total: $' + totalCost + '.00');

    if (cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML +=
                `
                <div class="product">
                    <div class="product-name">
                        <a class="remove-from-cart" href="#contact">
                            <i class="fas fa-times-circle"></i>
                        </a>
                        <img src="./images/${item.tag}.png">
                        <span>${item.name}</span>
                    </div>
                    <div class="product-price">$${item.price}.00</div>
                    <div class="product-quantity">
                        <a class="remove-product" href="#products">
                            <i class="fas fa-angle-left"></i>
                        </a>
                        <span>${item.inCart}<span>
                        <a class="add-product" href="#contact">
                            <i class="fas fa-angle-right"></i>
                        </a>
                    </div>
                    <div class="product-total-price">$${item.inCart * item.price}.00</div>
                </div>
                `
        });

        productContainer.innerHTML +=
            `
            <div class="cart-total-container">
                <h4 class="cart-total-price">
                    Total: $${totalCost}.00
               </h4>
            </div>
        `
    }
}

onLoadCartNumbers();
