document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== '') {
                e.preventDefault();
                const hash = this.hash;
                const target = document.querySelector(hash);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe work items for staggered animation
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach((item, index) => {
        item.style.setProperty('--animation-delay', `${index * 0.1}s`);
        observer.observe(item);
    });

    // Observe other items
    const otherItems = document.querySelectorAll('.other-item');
    otherItems.forEach((item, index) => {
        item.style.setProperty('--animation-delay', `${index * 0.1}s`);
        observer.observe(item);
    });

    // Parallax effect for header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const header = document.querySelector('header');
        if (header) {
            header.style.transform = `translateY(${rate}px)`;
        }
    });

    // Hover effects for work items
    const workItemsHover = document.querySelectorAll('.work-item');
    workItemsHover.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Typewriter effect for the main title
    const title = document.querySelector('h1');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        title.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 800);
    }

    // Featured work hover animation
    const featuredWork = document.querySelector('.featured-work');
    if (featuredWork) {
        featuredWork.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, rgba(74, 144, 226, 0.2), rgba(255, 215, 0, 0.2))';
        });
        
        featuredWork.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(255, 215, 0, 0.1))';
        });
    }

    // Floating animation for featured number
    const featuredNumber = document.querySelector('.featured-number');
    if (featuredNumber) {
        setInterval(() => {
            featuredNumber.style.animation = 'pulse 2s ease-in-out';
            setTimeout(() => {
                featuredNumber.style.animation = '';
            }, 2000);
        }, 5000);
    }

    // Dynamic background particles
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: rgba(74, 144, 226, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            animation: float-up ${Math.random() * 3 + 2}s linear forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 5000);
    };

    // Add particle animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-up {
            to {
                transform: translateY(-100vh);
                opacity: 0;
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.8s ease forwards;
        }
    `;
    document.head.appendChild(style);

    // Create particles periodically
    setInterval(createParticle, 500);

    // Loading animation
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            mainContent.style.transition = 'opacity 1s ease, transform 1s ease';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 500);
    }

    // Responsive navigation toggle for mobile
    const createMobileNav = () => {
        if (window.innerWidth <= 768) {
            const nav = document.querySelector('nav');
            if (nav && !nav.querySelector('.mobile-toggle')) {
                const toggle = document.createElement('button');
                toggle.className = 'mobile-toggle';
                toggle.innerHTML = '☰';
                toggle.style.cssText = `
                    background: none;
                    border: none;
                    color: var(--text);
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: none;
                `;
                
                nav.appendChild(toggle);
                
                toggle.addEventListener('click', () => {
                    nav.classList.toggle('mobile-open');
                });
            }
        }
    };

    createMobileNav();
    window.addEventListener('resize', createMobileNav);

    // Smooth reveal animation for sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 300 * (index + 1));
    });
});