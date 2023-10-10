//filter form

const filterForm = document.getElementById('productFilterForm')
filterForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const reqQuery = new URLSearchParams(new FormData(filterForm)).toString()
    console.log(reqQuery)
    fetch(`/products/filter?${reqQuery}`)
        .then(res => res.json())
        .then((res) => {
            if (res.success) {
                sortedProducts(res.products, res.cartAndWish)
            }
        })

})

const sortBy = document.getElementById('sortBy')
sortBy.addEventListener('change', (e) => {
    document.getElementById('filterSubmitButton').click()
})



function sortedProducts(products, cartAndWish) {
    const productRow = document.getElementById('productsRow')

    let rowProducts = ""

    for (let each of products) {
        let itemCol = `  <div class="col-lg-4 col-md-6 pt-md-0 pt-3 position-relative">
                        <a style="text-decoration: none;" href="/product/${each.product_id} ">
                            <div style="height: 350px;"
                                class="card d-flex flex-column align-items-center">

                                <div class="card-img"> <img src='${each.productImg[0]}' alt=""
                                        height="100" id="shirt"> </div>
                                <div class="product-name">
                                    ${each.productName} 
                                </div>
                                <div class="card-body pt-0">

                                    <div class="d-flex align-items-center price">
                                        <div class="del mr-2"><span class="text-dark"
                                                style="font-size: 15px;">Rs.${Number(each.productPrice) + 1000}</span></div>
                                        <div class="font-weight-bold "
                                            style="font-weight: bold; margin-left: 5px;">Rs.
                                            ${each.productPrice} 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                       
                        <div class="productButtons ps-2 position-absolute d-flex justify-content-between" style="top: 90%; width: 90%;">
                            ${cartAndWish && cartAndWish[0]?.cartIds && cartAndWish[0]?.cartIds.includes(each.product_id) ? `
                                <a class="default-button px-2 rounded d-block" href="/cart">Go to Cart -></a>
                            ` : `
                                <div class="pb-1 add-to-cart-btn" onclick="addToCart('${each.product_id}',this)">
                                    <i class="fa-solid fa-cart-plus" style="font-size: 25px;"></i>
                                </div>
                                <a class="buy-now-btn d-block " style="text-decoration: none;" href="/buynow/${each.product_id}">Buy Now -></a>
                            `}
                        </div>
                        <div class="wishlist position-absolute top-0 ms-1">
                            ${cartAndWish && cartAndWish[0]?.wishListIds?.includes(each.product_id) ? `
                                <i onclick="addToWishList('${each.product_id}',this)" id="biHrt" class="bi bi-heart-fill wishlist-icon"></i>
                            ` : `
                                <i onclick="addToWishList('${each.product_id}',this)" id="biHrt" class="bi bi-heart wishlist-icon"></i>
                            `}
                        </div>

                    </div>`

        rowProducts += itemCol
    }

    productRow.innerHTML = rowProducts
}





// For Filters
document.addEventListener("DOMContentLoaded", function () {
    // For Applying Filters
    $('#inner-box').collapse(false);
    $('#inner-box2').collapse(false);




    // Showing tooltip for AVAILABLE COLORS
    $(function () {
        $('[data-tooltip="tooltip"]').tooltip()
    })

    // For Range Sliders
    var inputLeft = document.getElementById("input-left");
    var inputRight = document.getElementById("input-right");

    var thumbLeft = document.querySelector(".slider > .thumb.left");
    var thumbRight = document.querySelector(".slider > .thumb.right");
    var range = document.querySelector(".slider > .range");

    var amountLeft = document.getElementById('amount-left')
    var amountRight = document.getElementById('amount-right')

    function setLeftValue() {
        var _this = inputLeft,
            min = parseInt(_this.min),
            max = parseInt(_this.max);

        _this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);

        var percent = ((_this.value - min) / (max - min)) * 100;

        thumbLeft.style.left = percent + "%";
        range.style.left = percent + "%";
        amountLeft.innerText = parseInt(percent * 100);
    }
    setLeftValue();

    function setRightValue() {
        var _this = inputRight,
            min = parseInt(_this.min),
            max = parseInt(_this.max);

        _this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);

        var percent = ((_this.value - min) / (max - min)) * 100;

        amountRight.innerText = parseInt(percent * 100);
        thumbRight.style.right = (100 - percent) + "%";
        range.style.right = (100 - percent) + "%";
    }
    setRightValue();

    inputLeft.addEventListener("input", setLeftValue);
    inputRight.addEventListener("input", setRightValue);

    inputLeft.addEventListener("mouseover", function () {
        thumbLeft.classList.add("hover");
    });
    inputLeft.addEventListener("mouseout", function () {
        thumbLeft.classList.remove("hover");
    });
    inputLeft.addEventListener("mousedown", function () {
        thumbLeft.classList.add("active");
    });
    inputLeft.addEventListener("mouseup", function () {
        thumbLeft.classList.remove("active");
    });

    inputRight.addEventListener("mouseover", function () {
        thumbRight.classList.add("hover");
    });
    inputRight.addEventListener("mouseout", function () {
        thumbRight.classList.remove("hover");
    });
    inputRight.addEventListener("mousedown", function () {
        thumbRight.classList.add("active");
    });
    inputRight.addEventListener("mouseup", function () {
        thumbRight.classList.remove("active");
    });
});