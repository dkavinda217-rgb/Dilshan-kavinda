// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

// Menu Toggle
const menuBtn = document.querySelector('#menu-btn');
const navbar = document.querySelector('.navbar');

if (menuBtn) {
    menuBtn.onclick = () => {
        menuBtn.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    };
}

// Scroll Sections Active Link
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        const top = window.scrollY;
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                if (document.querySelector('header nav a[href*=' + id + ']')) {
                    document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
                }
            });
        };
    });

    const header = document.querySelector('header');
    if (header) header.classList.toggle('sticky', window.scrollY > 100);

    if (menuBtn) {
        menuBtn.classList.remove('fa-times');
        navbar.classList.remove('active');
    }
};

// Scroll Reveal
if (typeof ScrollReveal !== 'undefined') {
    ScrollReveal({
        reset: true,
        distance: '80px',
        duration: 2000,
        delay: 200
    });

    ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
    ScrollReveal().reveal('.home-image, .services-container, .portfolio-box, .contact form', { origin: 'bottom' });
    ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
    ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });
}

/* =========================================
   Service Management (Admin Panel Logic)
   ========================================= */

// Default Services Data
const defaultServices = [
    {
        icon: 'fas fa-palette',
        title: 'Graphic Design',
        desc: "Logo design, branding, social media creatives, and marketing materials that capture your brand's essence."
    },
    {
        icon: 'fas fa-briefcase',
        title: 'Business Consulting',
        desc: 'Strategic planning and business development advice to help your startup or company grow sustainably.'
    },
    {
        icon: 'fas fa-bullhorn',
        title: 'Digital Marketing',
        desc: 'Promoting your business online to reach the right audience and convert leads into loyal customers.'
    }
];

// Load Services
function loadServices() {
    let services = JSON.parse(localStorage.getItem('myServices'));
    if (!services || services.length === 0) {
        services = defaultServices;
        localStorage.setItem('myServices', JSON.stringify(services));
    }
    return services;
}

// Render Services on Index Page
const servicesContainer = document.querySelector('.services-container');
if (servicesContainer) {
    const services = loadServices();
    servicesContainer.innerHTML = ''; // Clear default HTML content

    services.forEach(service => {
        const serviceDiv = document.createElement('div');
        serviceDiv.classList.add('service-box');
        serviceDiv.innerHTML = `
            <i class="${service.icon}"></i>
            <h3>${service.title}</h3>
            <p>${service.desc}</p>
            <a href="#contact" class="read-more">Learn More</a>
        `;
        servicesContainer.appendChild(serviceDiv);
    });
}

/* =========================================
   Portfolio Management (Admin Panel Logic)
   ========================================= */

// Default Portfolio Data (Initial Placeholders)
// Note: In a real scenario, this would be empty or fetched from server. 
// We include some defaults if empty so the site isn't blank.
const defaultPortfolio = [
    {
        title: 'Brand Identity',
        category: 'Logo Design',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799314348d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
    },
    {
        title: 'Social Media Kit',
        category: 'Digital Marketing',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80'
    },
    {
        title: 'Packaging Design',
        category: 'Product Design',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80'
    }
];

// Load Portfolio
function loadPortfolio() {
    let portfolio = JSON.parse(localStorage.getItem('myPortfolio'));
    if (!portfolio || portfolio.length === 0) {
        portfolio = defaultPortfolio;
        localStorage.setItem('myPortfolio', JSON.stringify(portfolio));
    }
    return portfolio;
}

// Render Portfolio on Index Page
const portfolioContainer = document.querySelector('.portfolio-container');
if (portfolioContainer) {
    const portfolio = loadPortfolio();
    portfolioContainer.innerHTML = ''; // Clear default HTML

    portfolio.forEach(Project => {
        const portBox = document.createElement('div');
        portBox.classList.add('portfolio-box');
        portBox.innerHTML = `
            <img src="${Project.image}" alt="${Project.title}">
            <div class="portfolio-layer">
                <h4>${Project.title}</h4>
                <p>${Project.category}</p>
                <a href="#"><i class="fas fa-external-link-alt"></i></a>
            </div>
        `;
        portfolioContainer.appendChild(portBox);
    });
}


// Admin Panel Logic (Services + Portfolio)
const adminForm = document.getElementById('addServiceForm');
const adminPortfolioForm = document.getElementById('addPortfolioForm');

const adminList = document.getElementById('adminServiceList');
const adminPortfolioList = document.getElementById('adminPortfolioList');

const iconSelect = document.getElementById('serviceIcon');
const iconPreview = document.getElementById('iconPreviewDisplay');

if (adminForm || adminPortfolioForm) {
    // 1. Render Admin Lists
    renderAdminList();
    renderPortfolioAdminList();

    // 2. Add New Service
    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newService = {
                title: document.getElementById('serviceTitle').value,
                desc: document.getElementById('serviceDesc').value,
                icon: document.getElementById('serviceIcon').value
            };

            const services = loadServices();
            services.push(newService);
            localStorage.setItem('myServices', JSON.stringify(services));

            alert('Service Added Successfully!');
            adminForm.reset();
            renderAdminList();
        });
    }

    // 3. Add New Project
    if (adminPortfolioForm) {
        adminPortfolioForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newProject = {
                title: document.getElementById('projectTitle').value,
                category: document.getElementById('projectCategory').value,
                image: document.getElementById('projectImage').value
            };

            const portfolio = loadPortfolio();
            portfolio.push(newProject);
            localStorage.setItem('myPortfolio', JSON.stringify(portfolio));

            alert('Project Added Successfully!');
            adminPortfolioForm.reset();
            renderPortfolioAdminList();
        });
    }

    // Icon Preview
    if (iconSelect) {
        iconSelect.addEventListener('change', function () {
            iconPreview.className = this.value;
        });
    }
}

function renderAdminList() {
    if (!adminList) return;
    adminList.innerHTML = '';
    const services = loadServices();

    if (services.length === 0) {
        adminList.innerHTML = '<p>No services added yet.</p>';
        return;
    }

    services.forEach((service, index) => {
        const item = document.createElement('div');
        item.className = 'service-item';
        item.innerHTML = `
            <div class="service-info">
                <h4><i class="${service.icon}"></i> ${service.title}</h4>
                <p>${service.desc}</p>
            </div>
            <button class="delete-btn" onclick="deleteService(${index})">Delete</button>
        `;
        adminList.appendChild(item);
    });
}

function renderPortfolioAdminList() {
    if (!adminPortfolioList) return;
    adminPortfolioList.innerHTML = '';
    const portfolio = loadPortfolio();

    if (portfolio.length === 0) {
        adminPortfolioList.innerHTML = '<p>No projects added yet.</p>';
        return;
    }

    portfolio.forEach((proj, index) => {
        const item = document.createElement('div');
        item.className = 'service-item'; // Reuse same style
        item.innerHTML = `
            <div class="service-info" style="display:flex; align-items:center; gap:1rem;">
                <img src="${proj.image}" style="width:50px; height:50px; object-fit:cover; border-radius:0.5rem;">
                <div>
                    <h4>${proj.title}</h4>
                    <p>${proj.category}</p>
                </div>
            </div>
            <button class="delete-btn" onclick="deleteProject(${index})">Delete</button>
        `;
        adminPortfolioList.appendChild(item);
    });
}

// Delete Service
window.deleteService = function (index) {
    if (confirm('Are you sure you want to delete this service?')) {
        let services = loadServices();
        services.splice(index, 1);
        localStorage.setItem('myServices', JSON.stringify(services));
        renderAdminList();
    }
};

// Delete Project
window.deleteProject = function (index) {
    if (confirm('Are you sure you want to delete this project?')) {
        let portfolio = loadPortfolio();
        portfolio.splice(index, 1);
        localStorage.setItem('myPortfolio', JSON.stringify(portfolio));
        renderPortfolioAdminList();
    }
};
