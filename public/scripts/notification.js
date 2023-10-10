
const notificationBox = document.getElementById('notificationBox')
const notification = document.querySelector('.notification');

// function called when the button to dismiss the message is clicked
function dismissMessage() {
    // remove the .received class from the .notification widget
    notification.classList.remove('received');

  
}

// function showing the message
function showMessage() {
    
    // add a class of .received to the .notification container
    notification.classList.add('received');

    // attach an event listener on the button to dismiss the message
    // include the once flag to have the button register the click only one time
    const button = document.querySelector('.notification__message button');
    button.addEventListener('click', dismissMessage, { once: true });

    setTimeout(dismissMessage,3000)
    setTimeout(()=>{
        notificationBox.style.display = 'none'
    },5000)
}

// function generating a message with a random title and text
function generateMessage(title,text) {
        notificationBox.style.display = 'flex'
        console.log('generation started')
        const message = document.querySelector('.notification__message');

        message.querySelector('h1').textContent = title;
        message.querySelector('p').textContent = text;
        message.className = `notification__message message--${title}`;

        // call the function to show the message
        showMessage();
  
}