
function deleteAddress(id, elem) {
    if (confirm('do you want to delete this address ?')) {
        let toDelete = elem.closest('.address-box')
        let delAdressUrl = `/delete-address/${id}`
        let reqOption = {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        }
        fetch(delAdressUrl, reqOption)
            .then(res => res.json())
            .then((res) => {
                if (res.success) {
                    toDelete.style.display = 'none'
                    generateMessage('success', 'address deleted successfully')
                } else {
                    window.location.herf = res.redirect
                }
            })
            .catch((e) => {
                generateMessage('danger', 'some error occured try again')
            })
    }
}


let resetPass = null
let userData = null
let emailInput = document.getElementById('email')
let nameInput = document.getElementById('name')

//onclick function to show edit profile modale
function editProfile() {
    resetPass = null
    fetch('/user-data')
        .then(res => res.json())
        .then((res) => {
            if (res.success) {
                emailInput.value = res.user.email
                nameInput.value = res.user.name
                userData = res.user.password
            } else {
                window.location.href = res.redirect
            }
        })
}

const myForm = document.getElementById('editProfileForm');

// Event listener for form submission
myForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    if (resetPass) {
        const confirmPassword = document.getElementById('confirmPassword')
        const newPassword = document.getElementById('newPassword')

        if (newPassword.value !== confirmPassword.value) {
            document.getElementById('pError').textContent = ' "second password doesnt match as first one !!!" '
            return
        }
    }
    // Get form data
    const formData = new FormData(myForm);

    console.log('hai')
    const formValues = {};

    // Iterate through form data and store it in the object
    formData.forEach((value, key) => {
        formValues[key] = value;
    });

    if (resetPass) {
        formValues.resetPassword = true
    }

    const updateModale = document.getElementById('exampleModal')

    updateModale.classList.remove('show');

    // Reset the modal backdrop (optional)
    document.querySelector('.modal-backdrop').remove();

    // Reset the body overflow (optional)
    document.body.classList.remove('modal-open');

    try {
        const response = await fetch('/edit-profile', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(formValues),
        });

        if (response.ok) {
            const data = await response.json();
            if(data.success){
                generateMessage('success', 'updated successfully')
            }else{
                generateMessage('danger', 'some error occured try later')
            }
        } else {
            console.error('Request failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

//event listener to close the modale if click on the background of modale

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;


function resetPassword() {
    let modalBody = document.getElementById('modalBody')
    modalBody.innerHTML = `
     <label for="oldPassword">Old Password</label><br>
    <input type="password" id="oldPassword" name="oldPassword" required><br>
    <label for="newPassword">New Password</label><br>
    <input type="password" id="newPassword" name="newPassword" required><br>
    <label for="confirmPassword">Confirm Password</label><br>
    <input type="password" id="confirmPassword" name="confirmPassword" required><br>
    <p class="error-message" id = "pError"></p>`

    resetPass = true

    const oldPassword = document.getElementById('oldPassword')
    oldPassword.addEventListener('blur', () => {
        if (oldPassword.value !== userData) {
            document.getElementById('pError').textContent = ' "please enter your correct password !!!" '
        } else {
            document.getElementById('pError').textContent = ''
        }
    })

}




