document.addEventListener('DOMContentLoaded', () => {
    // Initialize intersection observers for animations
    initSectionAnimations();
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Initialize scroll-triggered animations
    initScrollAnimations();
    
    // Initialize interactive elements
    initInteractiveElements();
    
    // Initialize dark mode toggle
    initDarkMode();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize magnetic buttons
    initMagneticButtons();
    
    // Initialize 3D card effects
    init3DCardEffects();
    
    // Initialize staggered animations
    initStaggeredAnimations();
    
    // Initialize reveal animations
    initRevealAnimations();
    
    // Initialize mobile menu
    initMobileMenu();
});

// Section animations with Intersection Observer
function initSectionAnimations() {
    const sections = document.querySelectorAll('.section-animate');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animations to children if they have the stagger-item class
                const staggerItems = entry.target.querySelectorAll('.stagger-item');
                staggerItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 100 + (index * 100));
                });
                
                // Once the animation is complete, we can stop observing this section
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% of the element is visible
        rootMargin: '0px 0px -10% 0px' // negative bottom margin to trigger earlier
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Parallax effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    if (parallaxElements.length === 0) return;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.1;
            const direction = element.dataset.direction || 'up';
            const limit = element.dataset.limit || 100;
            const yPos = direction === 'up' ? Math.min(scrollY * speed, limit) : Math.max(-scrollY * speed, -limit);
            element.style.transform = 'translate3d(0,' + yPos + 'px,0)';
        });
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.dataset.animation || 'fade-in';
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    element.classList.add(`animate-${animation}`);
                    element.style.opacity = 1;
                }, delay);
                
                animationObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = 0;
        animationObserver.observe(element);
    });
}

// Interactive elements
function initInteractiveElements() {
    document.querySelectorAll('.btn-ripple').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Dark mode toggle
function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const darkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
    const lightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');
    
    // Function to update icons based on current theme
    const updateIcons = () => {
        const isDark = document.documentElement.classList.contains('dark');
        
        // Update desktop icons
        if (darkIcon && lightIcon) {
            darkIcon.classList.toggle('hidden', isDark);
            lightIcon.classList.toggle('hidden', !isDark);
        }
        
        // Update mobile icons
        if (darkIconMobile && lightIconMobile) {
            darkIconMobile.classList.toggle('hidden', isDark);
            lightIconMobile.classList.toggle('hidden', !isDark);
        }
    };
    
    // Function to toggle dark mode
    const toggleDarkMode = () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
        updateIcons();
    };
    
    // Set initial theme based on localStorage or system preference
    if (localStorage.getItem('color-theme') === 'dark' || 
        (!localStorage.getItem('color-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Update icons to match current theme
    updateIcons();
    
    // Add event listeners to theme toggles
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }
    
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleDarkMode);
    }
}

// Smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if it's just "#"
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if it's open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                
                // Scroll to the target with offset for the fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Magnetic buttons effect
function initMagneticButtons() {}

// 3D card effects
function init3DCardEffects() {}

// Staggered animations
function initStaggeredAnimations() {
    const staggerContainers = document.querySelectorAll('.stagger-container');
    
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const items = container.querySelectorAll('.stagger-item');
                
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 100 + (index * 100));
                });
                
                staggerObserver.unobserve(container);
            }
        });
    }, {
        threshold: 0.1
    });
    
    staggerContainers.forEach(container => {
        staggerObserver.observe(container);
    });
}

// Reveal animations
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .reveal-down');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Mobile menu
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Add animation classes
            if (!mobileMenu.classList.contains('hidden')) {
                // Menu is now visible, add animation
                mobileMenu.classList.add('animate-slide-down');
                mobileMenu.style.opacity = '0';
                setTimeout(() => {
                    mobileMenu.style.opacity = '1';
                }, 10);
            } else {
                // Menu is now hidden, remove animation
                mobileMenu.classList.remove('animate-slide-down');
            }
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
    
    // Add scroll event to change navbar appearance
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
} 