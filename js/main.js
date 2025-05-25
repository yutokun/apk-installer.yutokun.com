document.addEventListener('DOMContentLoaded', () => {
    // ヘッダーとフッターを動的に読み込む
    loadComponents();

    // Detect touch device and add class
    const isTouchDevice = () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };
    
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    }
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
    
    // Feature card animation removed - now handled with pure CSS
    
    
    // Hero image animation removed

    // Carousel functionality
    const initializeCarousel = () => {
        const carousel = document.querySelector('.carousel-slides');
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const container = document.querySelector('.carousel-container');
        
        if (!carousel || slides.length === 0) return;
        
        let currentSlide = 0;
        let slideInterval;
        const slideCount = slides.length;
        let isAnimating = false;
        
        // Function to update carousel position
        const updateCarousel = () => {
            isAnimating = true;
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update active dot
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // Wait for transition to finish
            setTimeout(() => {
                isAnimating = false;
            }, 500); // Match this with your CSS transition time
        };
        
        // Go to next slide
        const nextSlide = () => {
            if (isAnimating) return;
            currentSlide = (currentSlide + 1) % slideCount;
            updateCarousel();
        };
        
        // Go to previous slide
        const prevSlide = () => {
            if (isAnimating) return;
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            updateCarousel();
        };
        
        // Go to specific slide
        const goToSlide = (index) => {
            if (isAnimating) return;
            currentSlide = index;
            updateCarousel();
            resetInterval();
        };
        
        // Reset automatic slideshow interval
        const resetInterval = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        };
        
        // Set up click handlers
        if (prevBtn) prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
            resetInterval();
        });
        
        if (nextBtn) nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
            resetInterval();
        });
        
        // Set up dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Initial setup
        updateCarousel();
        
        // Start automatic slideshow
        resetInterval();
        
        // Pause slideshow when mouse is over carousel
        if (container) {
            container.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            // Resume slideshow when mouse leaves carousel
            container.addEventListener('mouseleave', () => {
                resetInterval();
            });
        }
        
        // Touch swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(slideInterval);
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            resetInterval();
        }, { passive: true });
        
        const handleSwipe = () => {
            if (isAnimating) return;
            const swipeThreshold = 50; // Minimum swipe distance
            
            if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right
                prevSlide();
            } else if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left
                nextSlide();
            }
        };
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetInterval();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetInterval();
            }
        });
    };
    
    // Initialize carousel
    initializeCarousel();
});

// ヘッダーとフッターを動的に読み込む関数
async function loadComponents() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    if (headerPlaceholder) {
        try {
            const headerResponse = await fetch('/components/header.html');
            const headerContent = await headerResponse.text();
            headerPlaceholder.innerHTML = headerContent;
        } catch (error) {
            console.error('ヘッダーの読み込みに失敗しました:', error);
        }
    }
    
    if (footerPlaceholder) {
        try {
            const footerResponse = await fetch('/components/footer.html');
            const footerContent = await footerResponse.text();
            footerPlaceholder.innerHTML = footerContent;
        } catch (error) {
            console.error('フッターの読み込みに失敗しました:', error);
        }
    }
}

