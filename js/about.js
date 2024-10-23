// Mobile menu toggle
const burger = document.getElementById('burgerMenu');
const navLinks = document.getElementById('navLinks');

// Toggle navigation menu on hamburger click
burger.addEventListener('click', () => {
    navLinks.classList.toggle('active'); // Toggle active class to show/hide links
    burger.classList.toggle('toggle'); // Optional: for styling effect
});

// Optional: Close the navigation menu when a link is clicked (for better UX)
const navItems = document.querySelectorAll('.nav-links a');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active'); // Close menu on link click
    });
});
