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
    let totalCost = localStorage.getItem("totalCost");

    if (cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML +=
                `
                <div class="product">
                    <div class="product-name">
                        <a class="remove-from-cart" id=${item.name}>
                            <i class="fas fa-times-circle"></i>
                        </a>
                        <img src="./images/${item.tag}.png">
                        <span>${item.name}</span>
                    </div>
                    <div class="product-price">$${item.price}.00</div>
                    <div class="product-quantity">
                        <a class="remove-product" id=${item.name}>
                            <i class="fas fa-angle-left"></i>
                        </a>
                        <span>${item.inCart}<span>
                        <a class="add-product" id=${item.name}>
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
                <a class="cart-option clear-cart" href="#"><i class="fas fa-trash-alt"></i></a>
                <a class="cart-option payment" href="#"><i class="fas fa-cash-register"></i></a>
            </div>
        `
    } else {
        productContainer.innerHTML +=
            `
            <h4>Your cart is empty</h4>
            `
    }
    clearProduct();
    clearCart();
    removeProduct();
    addProduct();
}

function clearCart() {
    let clearCartButton = document.querySelector('.clear-cart');
    if (clearCartButton != null) {
        clearCartButton.addEventListener('click', function () {
            localStorage.clear();
            console.log('Clearing the cart...');
            location.reload();
        });
    }
}

function clearProduct() {
    let removeProductsButtons = document.querySelectorAll('.remove-from-cart');
    if (removeProductsButtons.length > 0) {
        for (let i = 0; i < removeProductsButtons.length; i++) {
            removeProductsButtons[i].addEventListener('click', function () {
                let productsInCart = JSON.parse(window.localStorage.getItem('productsInCart'));
                let cartCost = localStorage.getItem('totalCost');
                cartCost = parseInt(cartCost);
                let cartNumbers = localStorage.getItem('cartNumbers');
                cartNumbers = parseInt(cartNumbers);

                let productToRemove = productsInCart[removeProductsButtons[i].id];
                let productPrice = productToRemove.price;
                let productNumber = productToRemove.inCart;
                let productTotalCost = productNumber * productPrice;
                console.log('Products removed:', productToRemove);

                let newCartCost = cartCost - productTotalCost;
                let newCartNumbers = cartNumbers - productNumber;

                delete productsInCart[removeProductsButtons[i].id];

                if (Object.entries(productsInCart).length > 0) {
                    localStorage.setItem("productsInCart", JSON.stringify(productsInCart));
                    localStorage.setItem("totalCost", JSON.stringify(newCartCost));
                    localStorage.setItem("cartNumbers", JSON.stringify(newCartNumbers));
                    onLoadCartNumbers();
                } else {
                    localStorage.clear();
                }
                location.reload();

            });
        }
    }
}

function removeProduct() {
    let removeButtons = document.querySelectorAll(".remove-product");
    if (removeButtons.length > 0) {
        for (let i = 0; i < removeButtons.length; i++) {
            removeButtons[i].addEventListener('click', function () {
                let productsInCart = JSON.parse(window.localStorage.getItem('productsInCart'));
                let cartCost = localStorage.getItem('totalCost');
                cartCost = parseInt(cartCost);
                let cartNumbers = localStorage.getItem('cartNumbers');
                cartNumbers = parseInt(cartNumbers);
                console.log(cartNumbers);

                let productToRemove = productsInCart[removeButtons[i].id];

                if (productToRemove.inCart > 1) {
                    productToRemove.inCart = productToRemove.inCart - 1;
                } else {
                    delete productsInCart[removeButtons[i].id];
                }

                cartCost = cartCost - productToRemove.price;

                cartNumbers = cartNumbers - 1;

                if (Object.entries(productsInCart).length > 0) {
                    localStorage.setItem("productsInCart", JSON.stringify(productsInCart));
                    localStorage.setItem("totalCost", JSON.stringify(cartCost));
                    localStorage.setItem("cartNumbers", JSON.stringify(cartNumbers));
                    onLoadCartNumbers();
                } else {
                    localStorage.clear();
                    location.reload();
                }
            });
        }
    }
}

function addProduct() {
    let addButtons = document.querySelectorAll(".add-product");
    if (addButtons.length > 0) {
        for (let i = 0; i < addButtons.length; i++) {
            addButtons[i].addEventListener('click', function () {
                let productsInCart = JSON.parse(window.localStorage.getItem('productsInCart'));
                let cartCost = localStorage.getItem('totalCost');
                cartCost = parseInt(cartCost);
                let cartNumbers = localStorage.getItem('cartNumbers');
                cartNumbers = parseInt(cartNumbers);
                console.log(cartNumbers);

                let productToAdd = productsInCart[addButtons[i].id];

                productToAdd.inCart = productToAdd.inCart + 1;

                cartCost = cartCost + productToAdd.price;

                cartNumbers = cartNumbers + 1;

                localStorage.setItem("productsInCart", JSON.stringify(productsInCart));
                localStorage.setItem("totalCost", JSON.stringify(cartCost));
                localStorage.setItem("cartNumbers", JSON.stringify(cartNumbers));
                onLoadCartNumbers();
            });
        }
    }
}

onLoadCartNumbers();


