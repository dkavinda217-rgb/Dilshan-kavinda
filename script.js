/* =========================================
   FIREBASE CONFIGURATION (Database)
   The user's database: 'dilshan-kavinda'
   ========================================= */

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDu3yJpbJPKwOoSfYZsplcgeAzP5aGyhu0",
    authDomain: "dilshan-kavinda.firebaseapp.com",
    projectId: "dilshan-kavinda",
    storageBucket: "dilshan-kavinda.firebasestorage.app",
    messagingSenderId: "348555953133",
    appId: "1:348555953133:web:4242407a684fc4a7129de4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

/* =========================================
   UI & ANIMATIONS (Does not affect database)
   ========================================= */

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
   FIREBASE DATA LOADING (Services & Portfolio)
   ========================================= */

// Function to fetch services from Firestore
async function fetchServices() {
    const servicesContainer = document.querySelector('.services-container');
    const adminList = document.getElementById('adminServiceList');

    // Safety check - if container exists (index page) or admin list exists (admin page)
    if (!servicesContainer && !adminList) return;

    try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const services = [];
        querySnapshot.forEach((doc) => {
            services.push({ id: doc.id, ...doc.data() });
        });

        // If index page: Render cards
        if (servicesContainer) {
            servicesContainer.innerHTML = ''; // Clear existing content
            if (services.length === 0) {
                servicesContainer.innerHTML = '<p style="text-align:center; width:100%;">Loading services...</p>';
            }

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

        // If admin page: Render list
        if (adminList) {
            adminList.innerHTML = '';
            // Sort services if needed, currently random order from firestore
            services.forEach((service) => {
                const item = document.createElement('div');
                item.className = 'service-item';
                item.innerHTML = `
                    <div class="service-info">
                        <h4><i class="${service.icon}"></i> ${service.title}</h4>
                        <p>${service.desc}</p>
                    </div>
                    <button class="delete-btn" data-id="${service.id}" data-type="service">Delete</button>
                `;
                adminList.appendChild(item);
            });

            // Add Listeners to Delete Buttons
            document.querySelectorAll('.delete-btn[data-type="service"]').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if (confirm('Delete this service?')) {
                        const id = e.target.getAttribute('data-id');
                        await deleteDoc(doc(db, "services", id));
                        fetchServices(); // Refresh list
                    }
                });
            });
        }

    } catch (e) {
        console.error("Error fetching services: ", e);
    }
}

// Function to fetch portfolio from Firestore
async function fetchPortfolio() {
    const portfolioContainer = document.querySelector('.portfolio-container');
    const adminPortfolioList = document.getElementById('adminPortfolioList');

    if (!portfolioContainer && !adminPortfolioList) return;

    try {
        const querySnapshot = await getDocs(collection(db, "portfolio"));
        const portfolio = [];
        querySnapshot.forEach((doc) => {
            portfolio.push({ id: doc.id, ...doc.data() });
        });

        // If index page
        if (portfolioContainer) {
            portfolioContainer.innerHTML = '';
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

        // If admin page
        if (adminPortfolioList) {
            adminPortfolioList.innerHTML = '';
            portfolio.forEach((proj) => {
                const item = document.createElement('div');
                item.className = 'service-item';
                item.innerHTML = `
                    <div class="service-info" style="display:flex; align-items:center; gap:1rem;">
                        <img src="${proj.image}" style="width:50px; height:50px; object-fit:cover; border-radius:0.5rem;">
                        <div>
                            <h4>${proj.title}</h4>
                            <p>${proj.category}</p>
                        </div>
                    </div>
                    <button class="delete-btn" data-id="${proj.id}" data-type="portfolio" data-image="${proj.imageRef || ''}">Delete</button>
                `;
                adminPortfolioList.appendChild(item);
            });

            // Add Listeners to Delete Buttons
            document.querySelectorAll('.delete-btn[data-type="portfolio"]').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if (confirm('Delete this project?')) {
                        const id = e.target.getAttribute('data-id');
                        const imageRefPath = e.target.getAttribute('data-image');

                        // Delete from Firestore
                        await deleteDoc(doc(db, "portfolio", id));

                        // Delete from Storage if ref exists
                        if (imageRefPath) {
                            const imageRef = ref(storage, imageRefPath);
                            try {
                                await deleteObject(imageRef);
                            } catch (err) {
                                console.log("Error deleting image: ", err);
                            }
                        }

                        fetchPortfolio(); // Refresh list
                    }
                });
            });
        }

    } catch (e) {
        console.error("Error fetching portfolio: ", e);
    }
}

// Initialize Fetching
fetchServices();
fetchPortfolio();


/* =========================================
   ADMIN PANEL ADDING LOGIC (Firebase)
   ========================================= */

const adminForm = document.getElementById('addServiceForm');
const adminPortfolioForm = document.getElementById('addPortfolioForm');
const iconSelect = document.getElementById('serviceIcon');
const iconPreview = document.getElementById('iconPreviewDisplay');

if (adminForm) {
    // Add Service to Firestore
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('serviceTitle').value;
        const desc = document.getElementById('serviceDesc').value;
        const icon = document.getElementById('serviceIcon').value;

        try {
            await addDoc(collection(db, "services"), {
                title: title,
                desc: desc,
                icon: icon,
                createdAt: new Date()
            });
            alert("Service added successfully!");
            adminForm.reset();
            fetchServices(); // Refresh list immediately
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Error adding service. Check console.");
        }
    });
}

if (adminPortfolioForm) {
    // Add Portfolio to Firestore with Image Upload
    adminPortfolioForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('projectTitle').value;
        const category = document.getElementById('projectCategory').value;
        const file = document.getElementById('projectImageFile').files[0];

        if (!file) {
            alert("Please select an image!");
            return;
        }

        try {
            // 1. Upload Image to Firebase Storage
            const distinctFileName = Date.now() + "_" + file.name;
            const storageReference = ref(storage, 'portfolio_images/' + distinctFileName);

            // Show loading state
            const submitBtn = adminPortfolioForm.querySelector('button');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Uploading...";
            submitBtn.disabled = true;

            const snapshot = await uploadBytes(storageReference, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Save Data to Firestore
            await addDoc(collection(db, "portfolio"), {
                title: title,
                category: category,
                image: downloadURL,
                imageRef: 'portfolio_images/' + distinctFileName, // Store ref for deletion later
                createdAt: new Date()
            });

            alert("Project added successfully!");
            adminPortfolioForm.reset();
            fetchPortfolio(); // Refresh list immediately

            // Reset button
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;

        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Error adding project. Check console.");
            // Reset button
            const submitBtn = adminPortfolioForm.querySelector('button');
            submitBtn.innerText = "Add Project";
            submitBtn.disabled = false;
        }
    });
}

// Icon Preview
if (iconSelect) {
    iconSelect.addEventListener('change', function () {
        iconPreview.className = this.value;
    });
}
