// Toggle Navbar on Burger Click
const burgerMenu = document.getElementById('burgerMenu');
const navLinks = document.getElementById('navLinks');

burgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burgerMenu.classList.toggle('toggle');
});
