function removeFromList(elem,id){
    let toRemove = elem.closest('.cart-item')
    let removeURL = `/add-to-wishlist/${id}`
    let reqOption = {
        method : 'POST',
        headers : {
            'Content-type':'application/json'
        }
    }

    
    fetch(removeURL,reqOption)
    .then(res=>res.json())
    .then((res)=>{
        if(res.msg === 'removed'){
            toRemove.style.display = 'none',
            generateMessage('success','item removed successfully')
        }
    })
}