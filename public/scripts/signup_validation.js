const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPassword = document.getElementById('confirm_password');
const error = document.getElementById('error');
const validationForm = document.getElementById('validation_form');

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

function validateEmail() {
    if (emailPattern.test(emailInput.value)) {
        error.textContent = '';
    } else {
        error.textContent = 'Invalid email format';
    }
}

function validatePassword() {
    if (passwordPattern.test(passwordInput.value)) {
        error.textContent = '';
    } else {
        error.textContent = 'Password must be at least 8 characters long and contain at least one letter and one digit';
    }
}



emailInput.addEventListener('input', validateEmail);
passwordInput.addEventListener('input', validatePassword);

validationForm.addEventListener('submit', function (event) {
    if (!emailPattern.test(emailInput.value)) {
        error.textContent = 'Invalid email format';
        event.preventDefault();
    }

    if (!passwordPattern.test(passwordInput.value)) {
        error.textContent = 'Password must be at least 8 characters long and contain at least one letter and one digit';
        event.preventDefault();
    }
    if(confirmPassword.value !== passwordInput.value){
        error.textContent = 'Second password is not matching'
        event.preventDefault();
    }
});
