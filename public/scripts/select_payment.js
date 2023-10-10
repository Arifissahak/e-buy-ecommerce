let couponId = null;
let walletAmount = null;
function couponDiscount(id) {
    let itemSum = document.getElementById('itemSum')
    let couponTitle = document.getElementById('couponTitle')
    let couponVal = document.getElementById('couponValue')
    const couponURL = `/coupon-update/${id}`
    fetch(couponURL)
        .then(res => res.json())
        .then((res) => {
            if (res.success && !res.coupon) {
                couponVal.innerText = ''
                couponTitle.innerText = ''
                itemSum.innerText = res.total
            } else if (res.success) {
                let { couponCode, couponValue, couponType } = res.coupon
                let value;
                if (couponType === 'percent') {
                    value = `${couponValue}% off`
                } else {
                    value = `flat ₹${couponValue}`
                }
                couponId = id
                couponVal.innerText = value
                couponTitle.innerText = couponCode
                itemSum.innerText = res.total
            } else if (res.except) {
                couponTitle.innerText = ''
                couponVal.innerText = res.msg
                itemSum.innerText = res.total
            } else {
                window.location.href = res.redirect
            }
        })
}

const walletMoney = document.getElementById('walletMoney')

function changeSubmit(value) {
    const button = document.getElementById('formSubmitBtn')

    if (value === 'Wallet') {
        useWallet()
        button.type = 'button'
        button.setAttribute('onclick', `checkoutPayment('Wallet')`)
    }else{
        button.type = 'button'
        button.setAttribute('onclick', `checkoutPayment('UPI/Bank')`)
    }
    if (walletAmount && value !== 'Wallet') {
        walletMoney.innerText = walletAmount
    }



}


function changeButton() {
    const button = document.getElementById('formSubmitBtn')
    button.type = 'submit'
    button.removeAttribute('onclick')
    if (walletAmount) {
        walletMoney.innerText = walletAmount
    }
}

function useWallet() {
    let itemSum = document.getElementById('itemSum')
    const wallet = Number(walletMoney.innerText)
    const total = Number(itemSum.innerText)
    if (total <= wallet) {
        walletMoney.innerText = wallet - total
        walletAmount = wallet
    }else{
        const wallet = document.getElementById('wallet')
        const upi = document.getElementById('upi')

        wallet.disabled = true
        upi.checked = true
        generateMessage('info','insufficient balance on wallet')

    }
}



function checkoutPayment(value) {
    console.log(value)
    let pMethod = null;
    if (value === 'Wallet') {
        pMethod = 'Wallet'
    } else {
        pMethod = 'UPI/Bank'
    }
    const reqUrl = '/placeorder'
    const reqBody = {
        paymentMethod: pMethod
    }
    if (couponId) {
        reqBody.discountCoupon = couponId
    }

    fetch(reqUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    })
        .then(res => res.json())
        .then((res) => {
            if(res.success && res.wallet){
               return window.location.href = '/order-completed'
            }else if (res.success && res.online) {
                payment(res.orderInstance)
            }
        })
}

let failedRes = false;

function payment(orderDetails) {

    let options = {
        key: 'rzp_test_I2eI4IA95i9pa6',
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        order_id: orderDetails.id,
        name: 'Acme Corp',
        description: 'Payment for order #12345',
        "theme": {
            "color": "#000000"
        },
        "modal": {
            "ondismiss": function () {
                cancelPayment(orderDetails)
            }
        },
        handler: function (response) {
            console.log('this is b4 response')
            console.log(response)
            verifyPayment(response, orderDetails)
        }
    };

    const rzp = new Razorpay(options);

    rzp.on('payment.failed', function (response) {
        failedRes = true
    })
    rzp.open();
}

async function verifyPayment(payment, order) {
    const response = await fetch('/payment/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            payment,
            order
        })
    })
    const res = await response.json()
    if (res.success) {
        window.location.href = '/order-completed'
    } else {
        window.location.href = '/order-failed'
    }
}

async function paymentFailed(payment, order) {
    try {
       
        console.log('failed')
        const response = await fetch('/payment/fail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                payment,
                order
            })
        })
        const res = await response.json()
        if (res.success) {
            console.log('success1')
            window.location.href = '/order-failed'
        } else {
            console.log('success2')
            window.location.href = '/order-failed'
        }
    } catch (e) {
        console.log('error on p fail')
        console.log(e)
    }
}

async function cancelPayment(order) {
    try {
        const response = await fetch('/payment/dismiss', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order
            })
        })
        const res = await response.json()
        if (res.success) {
            window.location.href = '/order-failed'
        } else {
            window.location.href = '/'
        }
    } catch (error) {
        console.log(error)
    }
}