const baseUrl = 'https://shoppingcart-a3a71-default-rtdb.firebaseio.com/products.json';
document.addEventListener('DOMContentLoaded', fetchProducts);



const cartItems = [];
let cartItemCount=0;
function fetchProducts() {
    const productsList = document.querySelector('.products_container');

    fetch(baseUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            if (products && typeof products === 'object') {
                for (let [key, product] of Object.entries(products)) {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');

                    const productContainer = document.createElement('div');
                    productContainer.classList.add('product_container');

                    const productLeft = document.createElement('div');
                    productLeft.classList.add('product_left');

                    const image = document.createElement('img');
                    image.src = product.image;
                    image.alt = '';

                    productLeft.appendChild(image);

                    const productRight = document.createElement('div');
                    productRight.classList.add('product_right');

                    const productNameDiv = document.createElement('div');
                    productNameDiv.classList.add('product_name');
                    productNameDiv.textContent = product.name;

                    const productDescriptionDiv = document.createElement('div');
                    productDescriptionDiv.classList.add('product_description');
                    const descriptionParagraph = document.createElement('p');
                    descriptionParagraph.textContent = product.description;
                    productDescriptionDiv.appendChild(descriptionParagraph);

                    const productPriceDiv = document.createElement('div');
                    productPriceDiv.classList.add('product_price');
                    productPriceDiv.textContent = `₹ ${product.price}`;




                    const addToCartDiv = document.createElement('div');
                    addToCartDiv.classList.add('Add_to_cart');
                    const addToCartButton = document.createElement('button');
                    addToCartButton.textContent = 'Add to Cart';
                    addToCartButton.addEventListener('click', () => {
                        addToCart({ ...product, productId: key }); // Include productId
                    });

                    addToCartDiv.appendChild(addToCartButton);
                    productRight.appendChild(productNameDiv);
                    productRight.appendChild(productDescriptionDiv);
                    productRight.appendChild(productPriceDiv);
                    productRight.appendChild(addToCartDiv);
                    productContainer.appendChild(productLeft);
                    productContainer.appendChild(productRight);
                    productDiv.appendChild(productContainer);
                    productsList.appendChild(productDiv);
                }
            }
        });
}
const cartListIds = [];


let listofproducts = false;

let quantityCount = {}; 
function addToCart(product) {
    const existingItemIndex = cartItems.findIndex((item) => item.productId === product.productId);

    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += 1;
        quantityCount[product.productId]++; 
    } else {
       
        cartItems.push({ ...product, quantity: 1 });
        quantityCount[product.productId] = 1; 
    }
    console.log(`Quantity of product with ID ${product.productId}: ${quantityCount[product.productId]}`);

    updateCart();

    const cartList = document.getElementsByClassName('cart_bucket')[0];

    if (cartList) {
        cartList.style.display = 'none';
    }
    const cartListsButton = document.getElementById('cartListButton');
    const productsList = document.querySelector('.products_container');
    let isCartListVisible = false;

    cartListButton.addEventListener('click', function() {
        isCartListVisible = !isCartListVisible;
        if (isCartListVisible) {
            cartList.style.display = 'block';
            productsList.style.display = 'none';
        } else {
            productsList.style.display = 'block';
            cartList.style.display = 'none';
            
        }
    });
    let totalPrice=[];
   
}



function updateCart() {
    // debugger
    let totalPrice=0;
    const cartBucket = document.querySelector('.cart_bucket');
    const cartCountSpan = document.querySelector('.cart_count');

    cartBucket.innerHTML = '';
    cartCountSpan.textContent = cartItems.length; 

    let itemPrice;
    cartItems.forEach((item) => {
        itemPrice=0;
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart_item');

        const productImage = document.createElement('img');
        productImage.src = item.image;
        productImage.alt = '';

        const productNameDiv = document.createElement('div');
        productNameDiv.classList.add('product_name');
        productNameDiv.textContent = `${item.name}`;

        const productDescriptionDiv = document.createElement('div');
        productDescriptionDiv.classList.add('product_description');
        productDescriptionDiv.textContent = `${item.description}`;

        

        const productQuantityDiv=document.createElement('div');
        productQuantityDiv.classList.add('productQuantity');
        productQuantityDiv.textContent = `Quantity:   `;

        const productQuantitySpan=document.createElement('span');
        productQuantityDiv.classList.add('productQuantity');

        const quantity = quantityCount[item.productId] || 0; 
        productQuantitySpan.textContent = `${quantity}`;

        const increaseButton = document.createElement('button');
        increaseButton.classList.add('quantity_buttons');
        increaseButton.textContent = '+';
        increaseButton.addEventListener('click', () => {
            increaseQuantity(item.productId);
        });

        const decreaseButton = document.createElement('button');
        decreaseButton.classList.add('quantity_buttons');
        decreaseButton.textContent = '-';
        decreaseButton.addEventListener('click', () => {
            decreaseQuantity(item.productId);
        });

        const productPriceDiv = document.createElement('div');
        productPriceDiv.classList.add('product_price');
        itemPrice = item.price * (quantityCount[item.productId] || 0);
        totalPrice=totalPrice+itemPrice; 
        productPriceDiv.textContent = `₹ ${itemPrice}`;

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove_button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            removeFromCart(item);
        });

        const productRemoveButtonDiv = document.createElement('div');
        productRemoveButtonDiv.appendChild(removeButton);
        productQuantityDiv.appendChild(decreaseButton);
        productQuantityDiv.appendChild(productQuantitySpan);
        productQuantityDiv.appendChild(increaseButton);
        

        cartItemDiv.appendChild(productImage);
        cartItemDiv.appendChild(productNameDiv);
        cartItemDiv.appendChild(productDescriptionDiv);
        
        cartItemDiv.appendChild(productQuantityDiv);
        cartItemDiv.appendChild(productPriceDiv);
        cartItemDiv.appendChild(productRemoveButtonDiv);
        cartBucket.appendChild(cartItemDiv);
        ;
       
       
          
    });
   
   
    cartItemCount+=1;
    const totalCost=document.createElement('div');
    totalCost.classList.add('total_Cost');
    totalCost.textContent=`Total Cost : ₹ ${totalPrice}`;
    cartBucket.appendChild(totalCost);
    console.log(totalPrice);
   
    
}
    

function increaseQuantity(productId) {
    quantityCount[productId] = (quantityCount[productId] || 0) + 1;
    updateCart();
}

function decreaseQuantity(productId) {
    if (quantityCount[productId] && quantityCount[productId] > 1) { 
        quantityCount[productId]--;
    } else {
        quantityCount[productId] = 1; 
    }
    updateCart();
}


function removeFromCart(item) {
    const index = cartItems.indexOf(item);
    if (index !== -1) {
        cartItems.splice(index, 1);
        cartItemCount-=2;
        updateCart();
    }
    console.log(cartItemCount);

}



