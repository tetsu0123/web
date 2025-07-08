// Common JavaScript for all pages

// Initialize hamburger menu when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
});

// Hamburger menu functionality
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    
    if (!hamburger || !nav) return;
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Close menu when clicking nav links
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !nav.contains(event.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}