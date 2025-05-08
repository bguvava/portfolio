/**
 * Animation and Effects for Brian Guvava's Portfolio
 * Handles custom cursor, scroll animations, and interactive effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        // Initialize animations only if user doesn't prefer reduced motion
        // initCustomCursor(); // Disabled custom cursor
        initScrollAnimations();
        initSectionTransitions();
        initHoverEffects();
        initParallaxElements();
    } else {
        // Add a class for CSS to handle reduced motion
        document.body.classList.add('reduced-motion');
    }
});

/**
 * Custom cursor implementation - DISABLED
 * Keeping the code for reference but not executing it
 */
function initCustomCursor() {
    // Function is kept for reference but not called
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
        return;
    }
    
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    
    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    
    cursor.appendChild(cursorDot);
    cursor.appendChild(cursorRing);
    document.body.appendChild(cursor);
    
    // Track mouse position with optimized performance
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        // Smooth follow effect with interpolation
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);
    
    // Add interactive effects for clickable elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, [data-interactive]');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
    
    // Handle cursor states
    document.addEventListener('mousedown', () => cursor.classList.add('cursor-active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('cursor-active'));
    document.addEventListener('mouseleave', () => cursor.classList.add('cursor-hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('cursor-hidden'));
}

/**
 * Scroll-triggered animations using Intersection Observer for performance
 */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    // Create single observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationType = entry.target.dataset.animation || 'fade-up';
                entry.target.classList.add('animated', animationType);
                
                // Unobserve after animation to save resources
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe each element
    animateElements.forEach(el => observer.observe(el));
    
    // Staggered animations for groups of elements
    document.querySelectorAll('[data-stagger="true"]').forEach(container => {
        const staggerItems = container.querySelectorAll('.stagger-item');
        
        if (staggerItems.length > 0) {
            const staggerObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    staggerItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animated');
                        }, index * 100);
                    });
                    staggerObserver.unobserve(container);
                }
            }, { threshold: 0.1 });
            
            staggerObserver.observe(container);
        }
    });
}

/**
 * Smooth transitions between sections
 */
function initSectionTransitions() {
    // Check if the browser supports smooth scrolling natively
    const supportsScrollBehavior = 'scrollBehavior' in document.documentElement.style;
    
    const navLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                // Create transition effect
                const transition = document.createElement('div');
                transition.className = 'section-transition';
                document.body.appendChild(transition);
                
                // Animate transition
                setTimeout(() => {
                    transition.classList.add('active');
                    
                    setTimeout(() => {
                        // Get navbar height for offset
                        const navHeight = document.querySelector('#mainNav')?.offsetHeight || 0;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                        
                        // Use native smooth scrolling if supported, or fallback
                        if (supportsScrollBehavior) {
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        } else {
                            window.scrollTo(0, targetPosition);
                        }
                        
                        // Fade out transition
                        setTimeout(() => {
                            transition.classList.add('fade-out');
                            setTimeout(() => {
                                document.body.removeChild(transition);
                            }, 500);
                        }, 300);
                    }, 300);
                }, 50);
            }
        });
    });
}

/**
 * Interactive hover effects
 */
function initHoverEffects() {
    // Enhance project cards
    document.querySelectorAll('.project-card, .skill-card, .testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover-effect');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
    });
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Parallax effect for background elements
 * Uses requestAnimationFrame for smooth performance
 */
function initParallaxElements() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0 || window.innerWidth < 992) return;
    
    let ticking = false;
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                parallaxElements.forEach(element => {
                    const speed = parseFloat(element.dataset.parallax) || 0.2;
                    const yPos = -(lastScrollY * speed);
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

/**
 * Get image dimensions
 * This can be used in the browser console to check image dimensions
 * @param {string} imageSelector - CSS selector for the image
 * @return {Object} width and height of the image
 */
function getImageDimensions(imageSelector) {
    const img = document.querySelector(imageSelector);
    if (!img) {
        console.error('Image not found with selector:', imageSelector);
        return null;
    }
    
    return {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.width,
        displayHeight: img.height,
        aspectRatio: img.naturalWidth / img.naturalHeight
    };
}

// Usage examples (in browser console):
// getImageDimensions('img.project-image[src*="sales.png"]')
// getImageDimensions('img.project-image[src*="chase.png"]')
