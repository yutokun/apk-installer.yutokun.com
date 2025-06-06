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
        const dots = document.querySelectorAll('.carousel-dot');

        // For touch devices: handle scroll events to update dots
        if (document.body.classList.contains('touch-device')) {
            // Reset any transform on carousel slides for touch devices
            if (carousel) {
                carousel.style.transform = 'none';

                // Update dots based on scroll position
                const updateDotsOnScroll = () => {
                    if (!carousel || !dots.length) return;

                    const scrollLeft = carousel.scrollLeft;
                    const slideWidth = carousel.offsetWidth;
                    const currentSlide = Math.round(scrollLeft / slideWidth);

                    dots.forEach((dot, index) => {
                        if (index === currentSlide) {
                            dot.classList.add('active');
                        } else {
                            dot.classList.remove('active');
                        }
                    });
                };

                // Listen for scroll events on carousel-slides (the actual scrollable element)
                carousel.addEventListener('scroll', updateDotsOnScroll, {passive: true});

                // Set up dot click handlers for touch devices
                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        const slideWidth = carousel.offsetWidth;
                        carousel.scrollTo({
                            left: index * slideWidth,
                            behavior: 'smooth'
                        });
                    });
                });
            }
            return;
        }
        const slides = document.querySelectorAll('.carousel-slide');
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
            slideInterval = setInterval(nextSlide, 10000); // Change slide every 10 seconds
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

        // Use container for swipe detection on touch devices
        const swipeTarget = container || carousel;
        swipeTarget.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(slideInterval);
        }, {passive: true});

        swipeTarget.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            resetInterval();
        }, {passive: true});

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
    
    // 現在のページの言語を判定
    const isEnglish = window.location.pathname.includes('/en/');
    const headerFile = isEnglish ? 'components/header.html' : 'components/header.html';
    const footerFile = isEnglish ? 'components/footer.html' : 'components/footer.html';

    if (headerPlaceholder) {
        try {
            const headerResponse = await fetch(headerFile);
            const headerContent = await headerResponse.text();
            headerPlaceholder.innerHTML = headerContent;
            
            // ヘッダー読み込み後に言語選択機能を初期化
            initializeLanguageSelector();
        } catch (error) {
            console.error('ヘッダーの読み込みに失敗しました:', error);
        }
    }

    if (footerPlaceholder) {
        try {
            const footerResponse = await fetch(footerFile);
            const footerContent = await footerResponse.text();
            footerPlaceholder.innerHTML = footerContent;
        } catch (error) {
            console.error('フッターの読み込みに失敗しました:', error);
        }
    }
}

// 言語選択機能を初期化
function initializeLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    if (!languageSelect) return;
    
    // 現在のページの言語を判定して選択状態を設定
    const isEnglish = window.location.pathname.includes('/en/');
    languageSelect.value = isEnglish ? 'en' : 'ja';
    
    // 言語切り替えイベントリスナーを追加
    languageSelect.addEventListener('change', (e) => {
        const selectedLanguage = e.target.value;
        const currentPath = window.location.pathname;
        const currentFilename = currentPath.split('/').pop() || 'index.html';
        const isCurrentlyEnglish = currentPath.includes('/en/');
        
        if (selectedLanguage === 'en' && !isCurrentlyEnglish) {
            // 日本語版から英語版に切り替え
            window.location.href = `en/${currentFilename}`;
        } else if (selectedLanguage === 'ja' && isCurrentlyEnglish) {
            // 英語版から日本語版に切り替え
            window.location.href = `../${currentFilename}`;
        }
    });
}

