
let paginationRow = document.getElementById('pagination-row');

function renderProducts(products, num, cart, wishlist) {
    paginationRow.setAttribute('data-page-num', num)

    if (!products || products.length === 0) {
        paginationRow.innerHTML = `<div class="empty-message text-center">
        <h1>Sorry No Products Please Check after some time</h1>
        </div>`

        return
    }
    paginationRow.innerHTML = ``

    for (let each of products) {
        const productHtml = `
        <div class="col-lg-4 col-md-6">
            <div class="wrapper position-relative">
                <div class="wishlist-heart-group">
                    <input name="${each.product_id}" id="${each.product_id}" type="checkbox" ${wishlist && wishlist.includes(each.product_id) ? 'checked' : ''
            }/>
                    <label for="${each.product_id}" data-hover-text="${each.product_id}">
                        <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                            xmlns:cc="http://creativecommons.org/ns#"
                            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                            xmlns:svg="http://www.w3.org/2000/svg"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                            xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                            version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
                            <g transform="translate(0,-952.36218)">
                                <path style="color:#000000;enable-background:accumulate;"
                                    d="m 34.166665,972.36218 c -11.41955,0 -19.16666,8.91891 -19.16666,20.27029 0,19.45943 15,27.56753 35,39.72973 20.00001,-12.1622 34.99999,-20.2703 34.99999,-39.72973 0,-11.35137 -7.7471,-20.27029 -19.16665,-20.27029 -7.35014,0 -13.39148,4.05405 -15.83334,6.48647 -2.44185,-2.43241 -8.48319,-6.48647 -15.83334,-6.48647 z"
                                    fill="transparent" id="heart-path" stroke="#ffff"
                                    stroke-width="5" marker="none" visibility="visible"
                                    display="inline" overflow="visible" />
                            </g>
                        </svg>
                    </label>
                </div>
                <div class="container m-0 p-0">
                    <div class="top">
                        <img class="my-auto" src="${each.productImg[0]}" alt="">
                    </div>
                    <div class="bottom ${cart && cart.includes(each.product_id) ? 'clicked' : ''
            }">
                        <div class="left">
                            <div class="details">
                                <h6>${each.productName}</h6>
                                <p class="ind-rs">${each.productPrice}</p>
                            </div>
                            <div class="buy" onclick="addToCart('${each.product_id}',this,'card')">
                                <i class="material-icons" style="color: #fff;">add_shopping_cart</i>
                            </div>
                        </div>
                        <div class="right">
                            <div class="done"><a href="/cart"><i class="material-icons">shopping_cart_checkout</i></a></div>
                            <div class="details">
                                <h1></h1>
                                <p class="mt-3"><strong>Go to cart</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
            ;

        paginationRow.innerHTML += productHtml;
    }
}

function paginate(num, elem) {
    let paginationURL = `/paginate/${num}`
    let reqOption = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    }

    fetch(paginationURL, reqOption)
        .then(res => res.json())
        .then((res) => {
            if (res.success) {
                if (res.isUser) {
                    renderProducts(res.products, num, res.cart, res.wishlist)
                } else {
                    renderProducts(res.products, num)
                }
            }

        })
        .catch((e) => console.log(e))
}

function paginatePrev() {
    let pageNum = paginationRow.getAttribute('data-page-num')
    if (pageNum === 0) return
    if (pageNum > 0) {
        paginate(pageNum - 1);
    }

}

function paginateNext() {
    let pageNum = paginationRow.getAttribute('data-page-num')
    let pageButtons = document.querySelectorAll('.paginate-buttons')
    if (pageNum >= pageButtons.length - 1) return
    if (pageNum < pageButtons.length - 1) {
        paginate(Number(pageNum) + 1)
    }
}