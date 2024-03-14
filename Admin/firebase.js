const baseUrl = 'https://shoppingcart-a3a71-default-rtdb.firebaseio.com/products.json';

const tablebodyElement=document.getElementById('table_body');
document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
    AddProduct();
    AddProductPage();
});

//Fetching records
async function fetchPosts() {
  const headers = new Headers();
  const response = await fetch(baseUrl, {
      method: 'GET',
      headers: headers,
  });

  const posts = await response.json();

  let tableRows = '';

  // Check if posts is not empty and is an object
  if (posts && typeof posts === 'object') {
      for (let [key, post] of Object.entries(posts)) {
          tableRows +=
              `<tr>
                  <td>${key}</td>
                  <td>${post.name}</td>
                  <td>${post.description}</td>
                  <td>${post.image}</td>
                  <td>${post.price}</td>
                  <td>
                      <button class="update_button">UPDATE</button>
                      <button class="delete_button">DELETE</button>
                  </td>
              </tr>`;
      }
  }

  tablebodyElement.innerHTML = tableRows;

}

//Add product button
function AddProduct(){
    
    const addproductButton=document.getElementById('add_product');
    addproductButton.addEventListener('click',()=>{
    let addProduct=document.getElementById('add_Product_Page');
    addProduct.style.display='block';
});
}

//Close button
function closeModal() {
    let addRecord = document.getElementById('add_Product_Page');
    let updateRecord = document.getElementsByClassName('update_page');
    let productsList = document.getElementById('products_list');

    productsList.style.display = 'block';
    addRecord.style.display = 'none';

    // Check if updateRecord is not empty
    if (updateRecord.length > 0) {
        // Access the first element of updateRecord array
        updateRecord[0].style.display = 'none';
    }
}

const closeButton = document.querySelector('.close');
closeButton.addEventListener('click', () => {
    closeModal();
});

//cancel Button
const cancelButton=document.getElementsByClassName('cancel_button');
cancelButton[0].addEventListener('click',()=>{
    closeModal();
})


//Delete product
tablebodyElement.addEventListener('click', async (e) => {
    let target = e.target;
    if (target.classList.contains('delete_button')) {
        let postId = target.parentElement.parentElement.firstElementChild.textContent;

        const response = await fetch(`https://shoppingcart-a3a71-default-rtdb.firebaseio.com/products/${postId}.json`, {
            method: 'DELETE'
        });
        
        console.log('Record deleted successfully', response);
        fetchPosts();
    }
});

//Add Product
function AddProductPage(){
    const addModel = document.getElementById('add_Product_Page');
    addModel.addEventListener('submit', async (e) => {
    e.preventDefault();
    const productName = document.getElementById('name').value; 
    const productDescription = document.getElementById('description').value;
    const productImage = document.getElementById('productimage').value;
    const productPrice = document.getElementById('price').value;

    let postData = {
        name: productName,
        description: productDescription,
        image: productImage,
        price: productPrice

    };

    const response = await fetch(baseUrl, {
        method: 'POST',
       
        body: JSON.stringify(postData),
    });

    const newPost = await response.json();
    console.log('New record added:', newPost);
    fetchPosts();
    closeModal();
});
}


//Update fetch
let updatedProductId = '';
tablebodyElement.addEventListener('click', async (e) => {
    let target = e.target;
    if (target.classList.contains('update_button')) {
        document.getElementById('update_modal').style.display = 'block';

        let postId = target.parentElement.parentElement.firstElementChild.innerHTML;

        console.log('postId:', postId);

        if (postId.trim() !== '') {
            updatedProductId = postId;

            const response = await fetch(baseUrl);
            const posts = await response.json();
            console.log(posts);

            let selectedRecord = posts[updatedProductId];

            if (selectedRecord) {
                document.getElementById('nameUpdate').value = selectedRecord.name;
                document.getElementById('descriptionUpdate').value = selectedRecord.description;
                document.getElementById('productimageUpdate').value = selectedRecord.image;
                document.getElementById('priceUpdate').value = selectedRecord.price;
            }
        }
    }
});
//Update Post
let updateModal = document.getElementById('update_modal');
updateModal.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let productName = document.getElementById('nameUpdate').value;
    let productDescription = document.getElementById('descriptionUpdate').value;
    let productImage = document.getElementById('productimageUpdate').value;
    let productPrice = document.getElementById('priceUpdate').value;
    let updatedPost = {
        name: productName,
        description: productDescription,
        image: productImage,
        price: parseFloat(productPrice),
    };

    fetch(`https://shoppingcart-a3a71-default-rtdb.firebaseio.com/products/${updatedProductId}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
    })
    .then(response => {
        console.log('Post updated successfully');
        fetchPosts();
        closeModal();
    }
    );
    let productsList=document.getElementById('products_list');
    let updateRecord = document.getElementsByClassName('update_page');


    productsList.style.display='block';
    if (updateRecord.length > 0) {
        updateRecord[0].style.display = 'none';
    }
});



