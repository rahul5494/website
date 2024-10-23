// Burger menu toggle
const burgerMenu = document.getElementById('burgerMenu');
const navLinks = document.getElementById('navLinks');

burgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burgerMenu.classList.toggle('toggle');
});

// Password visibility toggle
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');

togglePassword.addEventListener('click', function () {
    // Toggle password visibility
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    // Toggle the eye icon
    this.classList.toggle('fa-eye-slash');
});
