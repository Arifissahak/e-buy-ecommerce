function addToCart(id, elem, third) {
    console.log('hai')
    fetch(`/add-to-cart/${id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }

    })
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            if (res.successMsg) {
                if (third === 'card') {
                    elem.closest('.bottom').classList.add('clicked')
                } else {
                    let newElement = document.createElement('a')
                    newElement.className = 'default-button px-2'
                    newElement.textContent = 'Go to Cart->'
                    newElement.href = '/cart'

                    elem.removeAttribute('onclick')
                    elem.replaceChild(newElement, elem.firstChild)
                }
                generateMessage('success', 'added to cart successfully')
            } else {
                window.location.href = res.redirect
            }
        }).catch((e) => {
            if (e) {
                console.log(e)
            }
        })
}


function addToWishList(id, icon) {
    console.log(icon)
    let wishListURL = `/add-to-wishlist/${id}`
    let reqOption = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        }
    }

    fetch(wishListURL, reqOption)
        .then(res => res.json())
        .then((res) => {
            if (res.success) {
                if (res.msg === 'added') {
                    icon.classList.remove('bi-heart');
                    icon.classList.add('bi-heart-fill');
                    generateMessage('success', 'product added to wishlist')
                } else {
                    icon.classList.remove('bi-heart-fill');
                    icon.classList.add('bi-heart');
                    generateMessage('success', 'product removed from wishlist')
                }
            } else {
                window.location.href = res.redirect
            }
        })
        .catch((e) => {
            console.log(e)
            alert('try again later')
        })
}


