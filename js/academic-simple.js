// Academic Simple JavaScript - Enhanced with Animations & Interactions

// Global functions for theme and language management
function setTheme(theme) {
    const body = document.body;
    const themeIcon = document.querySelector('#theme-toggle i');
    const themeToggle = document.getElementById('theme-toggle');
    
    body.setAttribute('data-theme', theme);
    
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            if (themeToggle) themeToggle.title = 'Switch to Light Mode';
        } else {
            themeIcon.className = 'fas fa-moon';
            if (themeToggle) themeToggle.title = 'Switch to Dark Mode';
        }
    }
    
    // Animate theme transition
    body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 300);
}

function setLanguage(lang) {
    const html = document.documentElement;
    const body = document.body;
    const langText = document.querySelector('#lang-toggle .lang-text');
    const langToggle = document.getElementById('lang-toggle');
    
    html.setAttribute('data-lang', lang);
    body.setAttribute('data-lang', lang);
    
    // Update language toggle button
    if (langText) {
        if (lang === 'en') {
            langText.textContent = '中';
            if (langToggle) langToggle.title = 'Switch to Chinese';
        } else {
            langText.textContent = 'EN';
            if (langToggle) langToggle.title = 'Switch to English';
        }
    }
    
    // Update all elements with language attributes immediately
    const elements = document.querySelectorAll('[data-en][data-zh]');
    elements.forEach(element => {
        const text = lang === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-zh');
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update document language
    document.documentElement.lang = lang === 'en' ? 'en-US' : 'zh-CN';
    
    // Update title based on current page
    const currentPage = window.location.pathname;
    if (currentPage.includes('mathematical-modeling')) {
        document.title = lang === 'en' ? 'Mathematical Modeling | Jin Modi' : '数学建模 | Jin Modi';
    } else if (currentPage.includes('my-company')) {
        document.title = lang === 'en' ? 'My Company | Jin Modi' : '我的公司 | Jin Modi';
    } else {
        document.title = lang === 'en' ? 'Jin Modi - Personal Homepage' : 'Jin Modi | 金莫迪';
    }
}

// Page Loading Animation removed as requested

// Scroll Progress Indicator
function createScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        indicator.style.width = scrolled + '%';
    });
}

// Scroll-triggered animations removed as requested

// Smooth scroll enhancement
function enhanceSmoothScroll() {
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add hover sound effects (optional)
function addHoverEffects() {
    const interactiveElements = document.querySelectorAll('.control-btn, .profile-link, .experience-org, .contact-social a');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Typing animation for specific elements
function addTypingAnimation(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function typeWriter() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    
    typeWriter();
}

// Parallax effect for background elements
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.profile-content::before, .contact::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Floating animation removed as requested

// Add ripple effect to buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.control-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation to CSS
    if (!document.querySelector('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced entrance animations removed as requested

// Page visibility change handler
function handleVisibilityChange() {
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            document.title = '👋 Come back soon! | Jin Modi';
        } else {
            const lang = document.documentElement.getAttribute('data-lang') || 'zh';
            const currentPage = window.location.pathname;
            if (currentPage.includes('mathematical-modeling')) {
                document.title = lang === 'en' ? 'Mathematical Modeling | Jin Modi' : '数学建模 | Jin Modi';
            } else if (currentPage.includes('my-company')) {
                document.title = lang === 'en' ? 'My Company | Jin Modi' : '我的公司 | Jin Modi';
            } else {
                document.title = lang === 'en' ? 'Jin Modi - Personal Homepage' : 'Jin Modi | 金莫迪';
            }
        }
    });
}

// Visit counter functionality
function initVisitCounter() {
    const visitCountElement = document.getElementById('visit-count');
    if (!visitCountElement) return;
    
    // Get current visit count from localStorage
    let visitCount = parseInt(localStorage.getItem('visitCount')) || 0;
    
    // Increment visit count
    visitCount += 1;
    
    // Save updated count to localStorage
    localStorage.setItem('visitCount', visitCount);
    
    // Display the count with animation
    visitCountElement.textContent = '0';
    let currentCount = 0;
    const increment = visitCount / 50; // Animation duration control
    
    const updateCount = () => {
        currentCount += increment;
        if (currentCount >= visitCount) {
            visitCountElement.textContent = visitCount;
        } else {
            visitCountElement.textContent = Math.floor(currentCount);
            requestAnimationFrame(updateCount);
        }
    };
    
    // Start animation after a short delay
    setTimeout(updateCount, 500);
}

// Update language content when DOM is ready (theme and lang attributes already set in head)
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = document.documentElement.getAttribute('data-lang') || 'zh';
    const savedTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // Sync body attributes with html attributes
    document.body.setAttribute('data-lang', savedLang);
    document.body.setAttribute('data-theme', savedTheme);
    
    // Update all elements with language attributes
    const elements = document.querySelectorAll('[data-en][data-zh]');
    elements.forEach(element => {
        const text = savedLang === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-zh');
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update title based on current page
    const currentPage = window.location.pathname;
    if (currentPage.includes('mathematical-modeling')) {
        document.title = savedLang === 'en' ? 'Mathematical Modeling | Jin Modi' : '数学建模 | Jin Modi';
    } else if (currentPage.includes('my-company')) {
        document.title = savedLang === 'en' ? 'My Company | Jin Modi' : '我的公司 | Jin Modi';
    } else {
        document.title = savedLang === 'en' ? 'Jin Modi - Personal Homepage' : 'Jin Modi | 金莫迪';
    }
    
    // Update lang toggle text
    const langText = document.querySelector('#lang-toggle .lang-text');
    if (langText) {
        langText.textContent = savedLang === 'en' ? '中' : 'EN';
    }
    
    // Initialize visit counter
    initVisitCounter();
});

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll indicator
    createScrollIndicator();
    
    // Get elements
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    
    // Get saved settings (already applied above)
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLang = localStorage.getItem('language') || 'zh';
    
    // Apply theme settings to toggle button
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        if (themeIcon) {
            if (savedTheme === 'dark') {
                themeIcon.className = 'fas fa-sun';
                themeToggle.title = 'Switch to Light Mode';
            } else {
                themeIcon.className = 'fas fa-moon';
                themeToggle.title = 'Switch to Dark Mode';
            }
        }
    }
    
    // Apply language settings to toggle button
    if (langToggle) {
        const langText = langToggle.querySelector('.lang-text');
        if (langText) {
            langText.textContent = savedLang === 'en' ? '中' : 'EN';
            langToggle.title = savedLang === 'en' ? 'Switch to Chinese' : 'Switch to English';
        }
    }
    
    // Theme Toggle Functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
    
    // Language Toggle Functionality
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            const currentLang = document.documentElement.getAttribute('data-lang') || 'zh';
            const newLang = currentLang === 'zh' ? 'en' : 'zh';
            setLanguage(newLang);
            localStorage.setItem('language', newLang);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
    
    // Initialize effects
    enhanceSmoothScroll();
    addHoverEffects();
    addRippleEffect();
    handleVisibilityChange();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + D toggles dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            if (themeToggle) themeToggle.click();
        }
        
        // Ctrl/Cmd + L toggles language
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            if (langToggle) langToggle.click();
        }
        
        // Escape key for any modal or overlay (future use)
        if (e.key === 'Escape') {
            // Close any open modals or overlays
        }
    });
    
    // Add smooth scrolling to top when clicking site title
    const siteTitle = document.querySelector('.site-title');
    if (siteTitle) {
        siteTitle.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log(`🚀 Page loaded in ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
            }, 0);
        });
    }
    
    console.log('🎓 Enhanced Academic Portfolio loaded successfully!');
    console.log('🎨 Animations and interactions ready!');
    console.log('⌨️  Keyboard shortcuts: Ctrl/Cmd + D (theme), Ctrl/Cmd + L (language)');
});

// Export functions for external use
window.AcademicPortfolio = {
    setTheme,
    setLanguage,
    addTypingAnimation,
    enhanceSmoothScroll
}; 