// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollIndicator = document.querySelector('.scroll-indicator');
const backToTop = document.querySelector('.back-to-top');
const sections = document.querySelectorAll('section');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
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

// Active Navigation Link
function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// Scroll Indicator
function updateScrollIndicator() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollIndicator.style.width = scrolled + '%';
}

// Back to Top Button
function toggleBackToTop() {
    if (window.pageYOffset > 300) {
        backToTop.style.display = 'flex';
    } else {
        backToTop.style.display = 'none';
    }
}

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll Event Listeners
window.addEventListener('scroll', () => {
    updateActiveLink();
    updateScrollIndicator();
    toggleBackToTop();
});

// Initial call to set correct state
window.addEventListener('load', () => {
    updateActiveLink();
    updateScrollIndicator();
    toggleBackToTop();
});

// Add fade-in animation to sections
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Add shadow to navbar on scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Lazy Loading
const lazyLoadSections = document.querySelectorAll('.about, .portfolio, .skills, .contact');
const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

lazyLoadSections.forEach(section => lazyLoadObserver.observe(section));

// Fetch GitHub Projects
function fetchGitHubProjects() {
    const githubProjectsContainer = document.getElementById('githubProjects');
    const username = 'MykeShale'; // Your GitHub username
    
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(projects => {
            if (projects.length === 0) {
                githubProjectsContainer.innerHTML = '<p class="no-projects">No projects found. Check back later!</p>';
                return;
            }
            
            let projectsAdded = 0;
            
            projects.forEach(project => {
                // Skip forked repositories
                if (project.fork) return;
                
                // Get languages for the project
                fetch(project.languages_url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(languages => {
                        const languageTags = Object.keys(languages).slice(0, 3);
                        
                        const projectCard = document.createElement('div');
                        projectCard.className = 'project-card';
                        projectCard.setAttribute('data-category', 'web');
                        
                        projectCard.innerHTML = `
                            <div class="project-image">
                                <img src="https://opengraph.githubassets.com/1/${username}/${project.name}" alt="${project.name}">
                            </div>
                            <div class="project-content">
                                <h3>${project.name}</h3>
                                <p class="project-tag">Web Project</p>
                                <p>${project.description || 'A web development project'}</p>
                                <div class="project-tech">
                                    ${languageTags.map(lang => `<span>${lang}</span>`).join('')}
                                </div>
                                <a href="${project.html_url}" target="_blank" class="project-link">View Project</a>
                            </div>
                        `;
                        
                        githubProjectsContainer.appendChild(projectCard);
                        projectsAdded++;
                        
                        // If no projects were added (all were forks), show a message
                        if (projectsAdded === 0 && project === projects[projects.length - 1]) {
                            githubProjectsContainer.innerHTML = '<p class="no-projects">No non-forked projects found. Check back later!</p>';
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching project languages:', error);
                        // Continue with other projects even if one fails
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching GitHub projects:', error);
            githubProjectsContainer.innerHTML = '<p class="error-message">Failed to load GitHub projects. Please try again later.</p>';
        });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchGitHubProjects);

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formInputs = contactForm.querySelectorAll('input, textarea');

// Add focus effects to form inputs
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
});

// Form submission handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (!name || !email || !message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Create mailto link
    const mailtoLink = `mailto:mikeayoti96@gmail.com?subject=${encodeURIComponent(subject || 'Contact from Portfolio')}&body=${encodeURIComponent(`Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Show success message
    showNotification('Message sent successfully!', 'success');
    
    // Reset form
    contactForm.reset();
});

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        background-color: var(--card-bg);
        color: var(--text-color);
        box-shadow: 0 5px 15px var(--shadow-color);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1000;
        animation: slideIn 0.3s ease forwards;
        border: 1px solid var(--border-color);
    }
    
    .notification.success {
        border-left: 4px solid var(--success-color);
    }
    
    .notification.error {
        border-left: 4px solid var(--error-color);
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification.success i {
        color: var(--success-color);
    }
    
    .notification.error i {
        color: var(--error-color);
    }
    
    .notification.fade-out {
        animation: slideOut 0.3s ease forwards;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .form-group.focused label {
        color: var(--primary-color);
    }
    
    .form-group.focused input,
    .form-group.focused textarea {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(0, 188, 212, 0.2);
    }
    
    .back-to-top {
        display: none;
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(45deg, var(--gradient-start), var(--gradient-end));
        color: white;
        border: none;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 5px 15px var(--shadow-color);
        transition: var(--transition);
        z-index: 999;
    }
    
    .back-to-top:hover {
        transform: translateY(-5px);
    }
    
    .no-projects, .error-message {
        text-align: center;
        padding: 2rem;
        color: var(--text-color);
        font-size: 1.1rem;
    }
`;
document.head.appendChild(notificationStyle);

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Function to set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateDarkModeIcon(theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#121212' : '#ffffff');
    } else {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = theme === 'dark' ? '#121212' : '#ffffff';
        document.head.appendChild(meta);
    }
}

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
const currentTheme = savedTheme || systemTheme;

// Set initial theme
setTheme(currentTheme);

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Add animation class to body
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
});

// Update dark mode icon
function updateDarkModeIcon(theme) {
    const icon = darkModeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
    }
});

// Add theme transition styles
const themeTransitionStyle = document.createElement('style');
themeTransitionStyle.textContent = `
    .theme-transition {
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .theme-transition * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
`;
document.head.appendChild(themeTransitionStyle);
