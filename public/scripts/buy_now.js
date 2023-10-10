// let itemCount = document.getElementById('itemsCount')
// let cartItemsDetails = document.getElementById('cartItemDetails');

// function resetItemCount() {
//     let cartItems = cartItemsDetails.querySelectorAll('.cart-item');
//     let blockedItem = cartItemsDetails.querySelectorAll('.blocked-product')
//     count = blockedItem ? Math.abs(blockedItem.length - cartItems.length) : cartItems.length;
//     itemCount.innerText = `items(${count})`
// }

// resetItemCount()

let itemSum = document.getElementById('itemSum')
let shippingCharge = document.getElementById('shippingCharge')
let totalSum = document.getElementById('totalSum')

function quantityChange(elem){
    let val = elem.value
    let productPrice = elem.getAttribute('data-product-price')
                let total = Number(productPrice)* val
                itemSum.innerText = total 
                if(total > 5000){
                  shippingCharge.className = " "
                  shippingCharge.innerText = 'free shipping'
                  totalSum.innerText = total
                }else if(total == 0){
                  shippingCharge.innerText = 0
                  totalSum.innerText = 0
                }else{
                  shippingCharge.innerText = 40
                  totalSum.innerText = total+40
                }
            
            
}


let submitForm = document.getElementById('buyNowForm')
let errMsg = document.getElementById('errorMessage')
submitForm.addEventListener('submit',(event)=>{
    let addressBox = document.querySelector('.address-box')
    if(!addressBox){
        event.preventDefault()
        generateMessage('warning','please add your address to proceed')
    }
})


