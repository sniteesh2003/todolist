document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the values from the input fields
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Simulated login credentials
    const validUsername = 'faiz';
    const validPassword = 'faiz123';

    // Check if the entered credentials match the valid ones
    if (username === validUsername && password === validPassword) {
        // Redirect to welcome.html if login is successful
        window.location.href = 'todolist.html';
    } else {
        // Show an error message if login fails
        errorMessage.textContent = 'Invalid username or password. Please try again.';
    }
});