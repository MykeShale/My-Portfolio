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

// GitHub Projects
async function fetchGitHubProjects() {
    const githubProjectsContainer = document.getElementById('githubProjects');
    if (!githubProjectsContainer) {
        console.error('GitHub projects container not found');
        return;
    }

    try {
        // Show loading state
        githubProjectsContainer.innerHTML = '<div class="loading">Loading projects...</div>';
        console.log('Fetching GitHub projects...');

        // Fetch user's repositories with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch('https://api.github.com/users/MykeShale/repos?sort=updated&direction=desc', {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Portfolio-Website'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
        }

        const repos = await response.json();
        console.log(`Fetched ${repos.length} repositories`);
        
        // Filter out forked repositories and sort by stars
        const projects = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6); // Limit to top 6 repositories

        console.log(`Found ${projects.length} non-forked projects`);

        if (projects.length === 0) {
            // If no projects found, show sample projects
            displaySampleProjects();
            return;
        }

        // Create project cards
        const projectCards = projects.map(project => `
            <div class="project-card">
                <div class="project-content">
                    <h3>${project.name}</h3>
                    <p>${project.description || 'No description available'}</p>
                    <div class="project-tech">
                        ${project.language ? `<span>${project.language}</span>` : ''}
                        <span>⭐ ${project.stargazers_count}</span>
                        <span>🔄 ${project.forks_count}</span>
                    </div>
                    <a href="${project.html_url}" target="_blank" class="project-link">
                        View Project <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        `).join('');

        githubProjectsContainer.innerHTML = projectCards;
        console.log('GitHub projects loaded successfully');

    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        
        // If there's an error, show sample projects
        displaySampleProjects();
    }
}

// Function to display sample projects
function displaySampleProjects() {
    const githubProjectsContainer = document.getElementById('githubProjects');
    
    const sampleProjects = [
        {
            name: 'Portfolio Website',
            description: 'A responsive portfolio website built with HTML, CSS, and JavaScript.',
            language: 'JavaScript',
            stars: 5,
            forks: 2,
            url: 'https://github.com/MykeShale/portfolio'
        },
        {
            name: 'E-commerce Platform',
            description: 'A full-stack e-commerce platform with React, Node.js, and MongoDB.',
            language: 'JavaScript',
            stars: 8,
            forks: 3,
            url: 'https://github.com/MykeShale/ecommerce'
        },
        {
            name: 'Task Management App',
            description: 'A task management application with user authentication and real-time updates.',
            language: 'TypeScript',
            stars: 12,
            forks: 4,
            url: 'https://github.com/MykeShale/task-manager'
        },
        {
            name: 'Weather Dashboard',
            description: 'A weather dashboard that displays current and forecasted weather data.',
            language: 'JavaScript',
            stars: 7,
            forks: 2,
            url: 'https://github.com/MykeShale/weather-dashboard'
        },
        {
            name: 'Recipe Finder',
            description: 'An application to search and save recipes from various sources.',
            language: 'JavaScript',
            stars: 6,
            forks: 1,
            url: 'https://github.com/MykeShale/recipe-finder'
        },
        {
            name: 'Budget Tracker',
            description: 'A PWA for tracking expenses and income with offline functionality.',
            language: 'JavaScript',
            stars: 9,
            forks: 3,
            url: 'https://github.com/MykeShale/budget-tracker'
        }
    ];
    
    const projectCards = sampleProjects.map(project => `
        <div class="project-card">
            <div class="project-content">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    <span>${project.language}</span>
                    <span>⭐ ${project.stars}</span>
                    <span>🔄 ${project.forks}</span>
                </div>
                <a href="${project.url}" target="_blank" class="project-link">
                    View Project <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `).join('');
    
    githubProjectsContainer.innerHTML = `
        <div class="sample-projects-notice">
            <p>Sample projects shown (GitHub API unavailable)</p>
        </div>
        ${projectCards}
    `;
}

// Add styles for loading and error states
const style = document.createElement('style');
style.textContent = `
    .loading, .no-projects, .error-message {
        text-align: center;
        padding: 2rem;
        background: var(--card-bg);
        border-radius: 10px;
        box-shadow: 0 5px 15px var(--shadow-color);
        margin: 1rem 0;
    }

    .loading {
        color: var(--text-color);
        font-size: 1.1rem;
    }

    .no-projects {
        color: var(--text-color);
        opacity: 0.8;
    }

    .error-message {
        color: var(--error-color);
    }

    .project-card {
        background: var(--card-bg);
        border-radius: 10px;
        padding: 1.5rem;
        box-shadow: 0 5px 15px var(--shadow-color);
        transition: transform 0.3s ease;
        border: 1px solid var(--border-color);
    }

    .project-card:hover {
        transform: translateY(-5px);
    }

    .project-content h3 {
        color: var(--text-color);
        margin-bottom: 1rem;
        font-size: 1.3rem;
    }

    .project-content p {
        color: var(--text-color);
        opacity: 0.8;
        margin-bottom: 1rem;
        line-height: 1.6;
    }

    .project-tech {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }

    .project-tech span {
        background: var(--card-bg);
        color: var(--text-color);
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.9rem;
        border: 1px solid var(--border-color);
    }

    .project-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: linear-gradient(45deg, var(--gradient-start), var(--gradient-end));
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .project-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 188, 212, 0.3);
    }
`;
document.head.appendChild(style);

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

// Ensure GitHub projects are loaded
fetchGitHubProjects();
