document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .cta-buttons a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add header shadow on scroll
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.04)';
        }
    });
    
    // Feature card animation on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    const animateOnScroll = elements => {
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    };
    
    // Add animation class to CSS
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        .feature-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
    `, styleSheet.cssRules.length);
    
    styleSheet.insertRule(`
        .feature-card.animate {
            opacity: 1;
            transform: translateY(0);
        }
    `, styleSheet.cssRules.length);
    
    // Set animation delay for each card
    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Initial check for elements in viewport
    animateOnScroll(featureCards);
    
    // Check for elements in viewport on scroll
    window.addEventListener('scroll', () => {
        animateOnScroll(featureCards);
    });
    
    // Step animation on scroll
    const steps = document.querySelectorAll('.step');
    
    // Add animation class to CSS for steps
    styleSheet.insertRule(`
        .step {
            opacity: 0;
            transform: translateX(-30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
    `, styleSheet.cssRules.length);
    
    styleSheet.insertRule(`
        .step.animate {
            opacity: 1;
            transform: translateX(0);
        }
    `, styleSheet.cssRules.length);
    
    // Set animation delay for each step
    steps.forEach((step, index) => {
        step.style.transitionDelay = `${index * 0.2}s`;
    });
    
    // Initial check for steps in viewport
    animateOnScroll(steps);
    
    // Check for steps in viewport on scroll
    window.addEventListener('scroll', () => {
        animateOnScroll(steps);
    });
    
    // Hero image animation
    const heroImg = document.getElementById('hero-img');
    if (heroImg) {
        window.addEventListener('mousemove', e => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const rotateY = (mouseX - 0.5) * 10; // -5 to 5 degrees
            const rotateX = (mouseY - 0.5) * -10; // -5 to 5 degrees
            
            heroImg.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });
    }
    
    // Reset hero image transform when mouse leaves
    document.addEventListener('mouseleave', () => {
        if (heroImg) {
            heroImg.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        }
    });
});