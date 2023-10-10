let itemCount = document.getElementById('itemsCount')
let cartItemsDetails = document.getElementById('cartItemDetails');

function resetItemCount() {
    let cartItems = cartItemsDetails.querySelectorAll('.cart-item');
    let blockedItem = cartItemsDetails.querySelectorAll('.blocked-product')
    count = blockedItem ? Math.abs(blockedItem.length - cartItems.length) : cartItems.length;
    itemCount.innerText = `items(${count})`
}

resetItemCount()



let itemSum = document.getElementById('itemSum')
let shippingCharge = document.getElementById('shippingCharge')
let totalSum = document.getElementById('totalSum')



function deleteItem(elem,id){
    let cartItem = elem.closest('.cart-item')
  
    const delItemUrl = `/delete-cart-item/${id}`
    const requestOption = {
      method : 'DELETE',
      headers : {
          'Content-type':'application/json'
      }
    } 

    fetch(delItemUrl,requestOption)
    .then(res=>res.json())
    .then((res)=>{
      if(res.success){
          let total = res.total
          cartItem.style.display = 'none'
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
          resetItemCount()
          generateMessage('success','item removed successfully')
          
      }else{
          alert(res.message);
      }
    })
    .catch((e)=>{
      console.log(e)
    })

  }

function quantityChange(elem){
    let val = elem.value
    let product_id = elem.getAttribute('data-product_id')
        let updateQuantityUrl = `/cartquantity?quantity=${val}&p_id=${product_id}`
        fetch(updateQuantityUrl)
        .then(res=>res.json())
        .then((res)=>{
            if(res.success){
                let total = res.total
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
        })         
}


