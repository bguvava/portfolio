/**
 * Brian Guvava Portfolio - Main JavaScript File
 * Version: 1.0
 * 
 * This file contains all custom JavaScript for the portfolio website
 */

// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        mirror: false
    });
    
    // Initialize all functions
    initThemeToggle();
    initScrollToTop();
    initSmoothScrolling();
    initNavbarToggle();
    initPreloader();
    setActiveNavLink();
    initParticles();
    // Initialize skills charts
    initSkillsCharts();
    // Initialize timeline functionality
    initTimeline();
    // Initialize projects filtering
    initProjectsFilter();
    // Set current year in footer
    setCurrentYear();
});

/**
 * Initialize Particles.js for hero section background
 */
function initParticles() {
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#3b82f6"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.3,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#3b82f6",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.8
                        }
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
    }
}

// Update theme elements to handle particle colors
function updateThemeElements(theme) {
    const navbar = document.getElementById('mainNav');
    const particlesContainer = document.getElementById('particles-js');
    
    if (theme === 'dark') {
        navbar.classList.add('navbar-dark');
        navbar.classList.remove('navbar-light');
        
        // Update particles color for dark mode if particles are initialized
        if (particlesContainer && window.pJSDom && window.pJSDom.length > 0) {
            window.pJSDom[0].pJS.particles.color.value = '#8b5cf6';
            window.pJSDom[0].pJS.particles.line_linked.color = '#8b5cf6';
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    } else {
        navbar.classList.add('navbar-light');
        navbar.classList.remove('navbar-dark');
        
        // Update particles color for light mode if particles are initialized
        if (particlesContainer && window.pJSDom && window.pJSDom.length > 0) {
            window.pJSDom[0].pJS.particles.color.value = '#3b82f6';
            window.pJSDom[0].pJS.particles.line_linked.color = '#3b82f6';
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }
}

/**
 * Initialize preloader
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // Show preloader while page loads
        window.addEventListener('load', function() {
            // Add fade-out class to trigger animation
            preloader.classList.add('fade-out');
            
            // Remove preloader from DOM after animation completes
            setTimeout(function() {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        });
    }
}

/**
 * Dark/Light mode toggle functionality
 */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or use device preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply saved theme on page load
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeIcon, savedTheme);
    
    // Update theme-dependent elements
    updateThemeElements(savedTheme);
    
    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        updateThemeIcon(themeIcon, newTheme);
        updateThemeElements(newTheme);
        
        // Add animation effect for theme transition
        document.documentElement.classList.add('theme-transition');
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 500);
    });
}

/**
 * Update theme icon based on current theme
 */
function updateThemeIcon(iconElement, theme) {
    if (theme === 'dark') {
        iconElement.classList.remove('fa-moon');
        iconElement.classList.add('fa-sun');
    } else {
        iconElement.classList.remove('fa-sun');
        iconElement.classList.add('fa-moon');
    }
}

/**
 * Scroll to top button functionality
 */
function initScrollToTop() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });
    
    // Scroll to top on button click
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Implement smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('#navbarResponsive .nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Get the height of the navbar
                    const navHeight = document.querySelector('#mainNav').offsetHeight;
                    
                    // Calculate the position to scroll to (target element's position - navbar height - small margin)
                    const targetPosition = targetElement.offsetTop - navHeight - 10;
                    
                    // Scroll to the target element
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close the navbar collapse on mobile
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        navbarCollapse.classList.remove('show');
                    }
                    
                    // Update active link
                    setActiveNavLink(targetId);
                }
            });
        }
    });
}

/**
 * Handle Navbar background change on scroll
 */
function initNavbarToggle() {
    const navbar = document.querySelector('#mainNav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-shrink');
        } else {
            navbar.classList.remove('navbar-shrink');
        }
    });
    
    // Initial check
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-shrink');
    }
}

/**
 * Set the active navigation link based on scroll position
 */
function setActiveNavLink(targetId = null) {
    const sections = document.querySelectorAll('section, header.hero-section');
    const navLinks = document.querySelectorAll('#navbarResponsive .nav-link');
    
    if (targetId) {
        // If targetId is provided, update based on that
        navLinks.forEach(link => {
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    } else {
        // Otherwise, update based on scroll position
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                    current = '#' + section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === current) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    // Initial active state based on current position
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            currentSection = '#' + section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
}

/**
 * Lazy load images for better performance
 */
function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Initialize radar chart for programming skills
 */
function initSkillsCharts() {
    // Programming Skills Radar Chart
    const programmingRadarChart = document.getElementById('programmingRadarChart');
    
    if (programmingRadarChart) {
        const radarChart = new Chart(programmingRadarChart, {
            type: 'radar',
            data: {
                labels: ['PHP', 'Python', 'JavaScript', 'HTML/CSS', 'SQL', 'VB.NET'],
                datasets: [{
                    label: 'Skill Level',
                    data: [90, 85, 88, 95, 90, 70],
                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    borderColor: 'rgba(37, 99, 235, 0.8)',
                    pointBackgroundColor: 'rgba(37, 99, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-light')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-light')
                        },
                        pointLabels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-dark'),
                            font: {
                                size: 12,
                                family: "'Poppins', sans-serif"
                            }
                        },
                        ticks: {
                            backdropColor: 'transparent',
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted')
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Skill Level: ${context.raw}%`;
                            }
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.2
                    }
                },
                responsive: true,
                maintainAspectRatio: true
            }
        });
        
        // Update chart colors when theme changes
        document.getElementById('theme-toggle').addEventListener('click', function() {
            setTimeout(() => {
                const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-dark');
                const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-light');
                const textMuted = getComputedStyle(document.documentElement).getPropertyValue('--text-muted');
                
                radarChart.options.scales.r.angleLines.color = borderColor;
                radarChart.options.scales.r.grid.color = borderColor;
                radarChart.options.scales.r.pointLabels.color = textColor;
                radarChart.options.scales.r.ticks.color = textMuted;
                
                radarChart.update();
            }, 500);
        });
    }
    
    // Animate the circular progress bars when they come into view
    const circularProgressElements = document.querySelectorAll('.progress-ring-circle');
    
    if (circularProgressElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const circle = entry.target;
                    const radius = circle.r.baseVal.value;
                    const circumference = radius * 2 * Math.PI;
                    
                    // Get the percentage from the parent container
                    const percentText = circle.closest('.circular-progress').querySelector('.progress-text h3').textContent;
                    const percent = parseInt(percentText.replace('%', ''));
                    
                    const offset = circumference - (percent / 100) * circumference;
                    circle.style.strokeDasharray = `${circumference} ${circumference}`;
                    circle.style.strokeDashoffset = circumference;
                    
                    // Trigger animation
                    setTimeout(() => {
                        circle.style.strokeDashoffset = offset;
                    }, 100);
                    
                    observer.unobserve(circle);
                }
            });
        }, { threshold: 0.1 });
        
        circularProgressElements.forEach(circle => {
            observer.observe(circle);
        });
    }
}

/**
 * Initialize the interactive timeline
 */
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        const toggleBtn = item.querySelector('.btn-toggle');
        const timelineHeader = item.querySelector('.timeline-header');
        
        // Toggle the active class when the toggle button is clicked
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
        
        // Toggle the active class when the header is clicked
        if (timelineHeader) {
            timelineHeader.addEventListener('click', (e) => {
                // Don't toggle if the toggle button was clicked (prevents double toggling)
                if (!e.target.closest('.btn-toggle')) {
                    item.classList.toggle('active');
                }
            });
        }
    });
    
    // If timeline items become visible, add staggered animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a small delay for each item to create a staggered effect
                setTimeout(() => {
                    entry.target.classList.add('animate-timeline');
                    
                    // Open the first timeline item by default
                    if (index === 0) {
                        entry.target.classList.add('active');
                    }
                }, index * 200);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

/**
 * Initialize projects filtering functionality
 */
function initProjectsFilter() {
    const filterButtons = document.querySelectorAll('.btn-filter');
    const projectItems = document.querySelectorAll('.project-item');
    const loadMoreBtn = document.querySelector('.btn-load-more');
    const itemsToShow = 6; // Number of items to show initially
    
    // Function to filter projects
    function filterProjects(filter) {
        let visibleCount = 0;
        
        projectItems.forEach(item => {
            // Remove hidden class from all items first
            item.classList.remove('hidden');
            
            // Check if the item matches the current filter
            const matchesFilter = filter === 'all' || item.classList.contains(filter);
            
            // Hide items that don't match the filter
            if (!matchesFilter) {
                item.classList.add('hidden');
            } else {
                visibleCount++;
                
                // Hide items beyond the initial count
                if (visibleCount > itemsToShow) {
                    item.classList.add('hidden');
                }
            }
        });
        
        // Show/hide load more button based on visible items count
        if (visibleCount <= itemsToShow) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
        
        // Update button state for load more
        loadMoreBtn.setAttribute('data-filter', filter);
        loadMoreBtn.setAttribute('data-showing', itemsToShow);
    }
    
    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to the clicked button
            this.classList.add('active');
            
            // Get the filter value from the button
            const filter = this.getAttribute('data-filter');
            
            // Apply the filter
            filterProjects(filter);
            
            // Add animation to filtered items
            projectItems.forEach(item => {
                if (!item.classList.contains('hidden')) {
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                }
            });
        });
    });
    
    // Load more button functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter') || 'all';
            let showing = parseInt(this.getAttribute('data-showing')) || itemsToShow;
            let visibleCount = 0;
            let shownCount = 0;
            
            projectItems.forEach(item => {
                // Check if the item matches the current filter
                const matchesFilter = filter === 'all' || item.classList.contains(filter);
                
                if (matchesFilter) {
                    visibleCount++;
                    
                    if (visibleCount <= showing) {
                        // Keep already visible items
                        shownCount++;
                    } else if (shownCount < showing + itemsToShow) {
                        // Show additional items
                        item.classList.remove('hidden');
                        item.style.animation = 'fadeIn 0.5s ease forwards';
                        shownCount++;
                    }
                }
            });
            
            // Update the number of items being shown
            this.setAttribute('data-showing', shownCount);
            
            // Hide load more button if all items are visible
            if (shownCount >= visibleCount) {
                this.style.display = 'none';
            }
        });
    }
    
    // Apply initial filtering (show all)
    filterProjects('all');
}

/**
 * Set the current year in the footer
 */
function setCurrentYear() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// Load images after page load for better performance
window.addEventListener('load', lazyLoadImages);
