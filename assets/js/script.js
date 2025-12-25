/**
 * Wealthome - Real Estate Website
 * JavaScript functionality with cursor-responsive background
 */

'use strict';

// ============================================
// CURSOR RESPONSIVE BACKGROUND
// ============================================
class CursorBackground {
    constructor() {
        this.cursorGlow = document.getElementById('cursorGlow');
        this.cursorGlowSecondary = document.getElementById('cursorGlowSecondary');
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.currentX = this.mouseX;
        this.currentY = this.mouseY;
        this.secondaryX = this.mouseX;
        this.secondaryY = this.mouseY;
        
        this.init();
    }
    
    init() {
        if (!this.cursorGlow) return;
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Smooth animation loop
        this.animate();
    }
    
    animate() {
        // Smooth interpolation for primary glow
        const ease = 0.08;
        this.currentX += (this.mouseX - this.currentX) * ease;
        this.currentY += (this.mouseY - this.currentY) * ease;
        
        // Slower interpolation for secondary glow
        const easeSecondary = 0.04;
        this.secondaryX += (this.mouseX - this.secondaryX) * easeSecondary;
        this.secondaryY += (this.mouseY - this.secondaryY) * easeSecondary;
        
        if (this.cursorGlow) {
            this.cursorGlow.style.left = `${this.currentX}px`;
            this.cursorGlow.style.top = `${this.currentY}px`;
        }
        
        if (this.cursorGlowSecondary) {
            this.cursorGlowSecondary.style.left = `${this.secondaryX}px`;
            this.cursorGlowSecondary.style.top = `${this.secondaryY}px`;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
class Header {
    constructor() {
        this.header = document.getElementById('header');
        this.lastScroll = 0;
        
        this.init();
    }
    
    init() {
        if (!this.header) return;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            this.lastScroll = currentScroll;
        });
    }
}

// ============================================
// MOBILE NAVIGATION
// ============================================
class MobileNav {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        
        this.init();
    }
    
    init() {
        if (!this.navToggle || !this.navbar) return;
        
        this.navToggle.addEventListener('click', () => {
            this.navbar.classList.toggle('active');
            const icon = this.navToggle.querySelector('.material-symbols-rounded');
            icon.textContent = this.navbar.classList.contains('active') ? 'close' : 'menu';
        });
        
        // Close menu when clicking on a link
        const navLinks = this.navbar.querySelectorAll('.navbar-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navbar.classList.remove('active');
                const icon = this.navToggle.querySelector('.material-symbols-rounded');
                icon.textContent = 'menu';
            });
        });
    }
}

// ============================================
// SEARCH TABS
// ============================================
class SearchTabs {
    constructor() {
        this.tabs = document.querySelectorAll('.search-tab');
        
        this.init();
    }
    
    init() {
        if (!this.tabs.length) return;
        
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }
}

// ============================================
// CONTACT FORM
// ============================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            console.log('Contact form submitted:', data);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            this.form.reset();
        });
    }
}

// ============================================
// AUTH FORMS
// ============================================
class AuthForms {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        
        this.init();
    }
    
    init() {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email')?.value;
                const password = document.getElementById('password')?.value;
                
                try {
                    const response = await fetch('/.netlify/functions/login-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });
                    
                    const result = await response.json();

                    if (response.ok) {
                        alert('Login successful!');
                        // Redirect to a dashboard or home page
                        window.location.href = '/';
                    } else {
                        alert(`Login failed: ${result.error}`);
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    alert('An error occurred during login.');
                }
            });
        }
        
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('name')?.value;
                const email = document.getElementById('email')?.value;
                const password = document.getElementById('password')?.value;
                const confirmPassword = document.getElementById('confirmPassword')?.value;
                
                if (password !== confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                }
                
                try {
                    const response = await fetch('/.netlify/functions/register-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });
                    
                    const result = await response.json();

                    if (response.ok) {
                        alert('Registration successful!');
                        window.location.href = 'login.html';
                    } else {
                        alert(`Registration failed: ${result.error}`);
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                    alert('An error occurred during registration.');
                }
            });
        }
    }
}

// ============================================
// VISITOR COUNTER
// ============================================
class VisitorCounter {
    constructor() {
        this.visitorCountEl = document.getElementById('visitors-count');
        this.init();
    }

    async init() {
        if (!this.visitorCountEl) return;

        try {
            const response = await fetch('/.netlify/functions/track-visitor');
            const result = await response.json();

            if (response.ok) {
                this.animateCounter(result.count);
            } else {
                console.error('Failed to track visitor:', result.error);
            }
        } catch (error) {
            console.error('Error tracking visitor:', error);
        }
    }

    animateCounter(target) {
        let current = 0;
        const duration = 2000; // 2 seconds
        const start = performance.now();

        const animate = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            current = Math.floor(target * easeOutQuart);

            this.visitorCountEl.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure final value is set correctly
                this.visitorCountEl.textContent = target;
            }
        };

        requestAnimationFrame(animate);
    }
}

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cursor background
    new CursorBackground();
    
    // Initialize header
    new Header();
    
    // Initialize mobile navigation
    new MobileNav();
    
    // Initialize search functionality
    new SearchTabs();
    
    // Initialize contact form
    new ContactForm();
    
    // Initialize auth forms
    new AuthForms();

    // Initialize visitor counter
    new VisitorCounter();
    
    console.log('Wealthome initialized successfully');
});
