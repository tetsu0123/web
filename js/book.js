// Shared interactions for book detail pages
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for back links
    const backLinks = document.querySelectorAll('.back-link');
    backLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').includes('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply fade-in animation to sections
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(section);
    });

    // Enhanced character cards hover effects
    const characterCards = document.querySelectorAll('.character');
    characterCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Theme cards interactive effects
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            themeCards.forEach(otherCard => {
                if (otherCard !== this) {
                    otherCard.style.opacity = '0.7';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            themeCards.forEach(otherCard => {
                otherCard.style.opacity = '';
            });
        });
    });

    // Progressive text enhancement for better readability
    const textElements = document.querySelectorAll('.synopsis p, .character-desc');
    textElements.forEach(element => {
        element.style.transition = 'all 0.3s ease';
    });

    // Book cover hover effect - disabled

    // Quote animation
    const quote = document.querySelector('.quote');
    if (quote) {
        const quoteObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    quote.style.animation = 'fadeInUp 0.8s ease-out';
                }
            });
        }, { threshold: 0.3 });
        
        quoteObserver.observe(quote);
    }
});

// CSS animations for better visual feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .character {
        transition: all 0.3s ease;
    }
    
    .book-cover {
        transition: all 0.4s ease;
    }
    
    .synopsis p {
        transition: color 0.3s ease;
    }
    
    .synopsis p:hover {
        color: var(--text);
    }
`;
document.head.appendChild(style);
