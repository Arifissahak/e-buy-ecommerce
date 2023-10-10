function getOtp(){
    const errMsg = document.getElementById('err-message')
    const email = document.getElementById('email').value
    if(!email){
        // errMsg.className = 'error-message'
        errMsg.innerText = 'enter your email'
        
    }
    const body = {
        email : email
    }
    const url = '/get-otp';
    fetch(url,{
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body)
    }).
    then((response)=>{
       return response.json()
    }).then((response)=>{
        if(response.successMsg){
            window.location.href = response.redirect
        }else{
            errMsg.innerText = 'we dont have your number'
        }
    })
}