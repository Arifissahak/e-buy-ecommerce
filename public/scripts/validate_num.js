const weightInput = document.getElementById('weight')
const priceInput = document.getElementById('price')
const quantityInput = document.getElementById('quantity')

const validationForm = document.getElementById('validation_form')
const error = document.getElementById('error')

function validateNumber(number) {
    // Check if the number is a valid non-negative integer
    return (Number.isInteger(number) && number >= 0);
}


const integerPattern = /^[1-9][0-9]*$/gm

function validatePrice() {
    return validateNumber(Number(priceInput.value));
    // return  (integerPattern.test(priceInput.value))
    // if (integerPattern.test(priceInput.value)) {
    //     displayError('')
    // } else {
    //     displayError('Price value is not acceptable')
    // }
}

function validateQuantity() {
    return validateNumber(Number(quantityInput.value));
    // return (integerPattern.test(quantityInput.value));
    // if (integerPattern.test(quantityInput.value)) {
    //     displayError('')
    // } else {
    //    displayError('quantity value is not acceptable');
    // }
}

function displayError(message) {
    error.textContent = message;
    return message.length < 1;
}

function validateInputs() {
    if (!validatePrice()) return displayError("Invalid price")
    if (!validateQuantity()) return displayError("Invalid qty")
    return displayError('');
}

priceInput.addEventListener('input', validateInputs)
quantityInput.addEventListener('input', validateInputs)

validationForm.addEventListener('submit', function (event) {
    console.log("hello");
    event.preventDefault();
    const isValid = validateInputs();
    if (isValid) {
        console.log("submitted")
        displayError('');
        validationForm.submit();
    } else {
        displayError("please fill all fields")
    }
});