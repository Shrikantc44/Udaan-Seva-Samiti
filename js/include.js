// js/include.js
// Navbar/Footer load karta hai, hamburger menu chalata hai aur Netlify Identity (login/logout) sambhalta hai.

// ---------- Hamburger menu (event delegation: navbar baad mein inject hota hai, phir bhi chalega) ----------
function toggleMenu() {
    const menu = document.querySelector('.menu');
    if (menu) menu.classList.toggle('active');
}

document.addEventListener('click', (e) => {
    // Hamburger button dabane par menu open/close
    if (e.target.closest('#mobile-menu-btn, .menu-toggle')) {
        const m = document.querySelector('.menu');
        if (m) m.classList.toggle('active');
        return;
    }
    // Menu ka link dabane par ya menu ke bahar click karne par menu band
    const menu = document.querySelector('.menu.active');
    if (menu && (e.target.closest('.menu a') || !e.target.closest('.navbar'))) {
        menu.classList.remove('active');
    }
});

// ---------- Netlify Identity ----------
let currentUser = null;

function updateAuthUI(user) {
    const loginLi = document.getElementById('loginLi');
    const logoutLi = document.getElementById('logoutLi');
    const nameDisplay = document.getElementById('userNameDisplay');

    if (user) {
        if (loginLi) loginLi.setAttribute('style', 'display: none !important');
        if (logoutLi) {
            logoutLi.style.display = 'flex';
            logoutLi.style.alignItems = 'center';
        }
        if (nameDisplay) {
            nameDisplay.innerHTML = `
                <a href="/dashboard.html" title="Go to Dashboard" style="color: #ff9800; font-size: 1.1rem; text-decoration: none; margin-right: 15px; font-weight: bold;">
                    <i class="fas fa-user-circle"></i> Dashboard
                </a>`;
        }
    } else {
        if (loginLi) { loginLi.removeAttribute('style'); loginLi.style.display = 'block'; }
        if (logoutLi) logoutLi.style.display = 'none';
    }
}

function setupNetlifyIdentity() {
    if (typeof netlifyIdentity === 'undefined') {
        console.warn("Netlify Identity widget not found");
        return;
    }

    // Handlers pehle, init() baad mein (init event miss na ho)
    netlifyIdentity.on('init', user => { currentUser = user; updateAuthUI(user); });
    netlifyIdentity.on('login', user => {
        currentUser = user;
        updateAuthUI(user);
        netlifyIdentity.close();
        window.location.href = "/dashboard.html";
    });
    netlifyIdentity.on('logout', () => {
        currentUser = null;
        updateAuthUI(null);
        window.location.href = "/index.html";
    });

    // Logout button (event delegation)
    document.addEventListener('click', (e) => {
        if (e.target.closest('#logoutBtn')) {
            e.preventDefault();
            netlifyIdentity.logout();
        }
    });

    netlifyIdentity.init();
}

// ---------- Components load ----------
async function includeHTML() {
    const components = [
        { id: 'navbar-placeholder', url: '/components/navbar.html' },
        { id: 'footer-placeholder', url: '/components/footer.html' }
    ];

    for (const component of components) {
        const element = document.getElementById(component.id);
        if (element) {
            try {
                const response = await fetch(component.url);
                if (!response.ok) throw new Error("File not found");
                element.innerHTML = await response.text();
            } catch (error) {
                console.error(`Error loading ${component.url}:`, error);
            }
        }
    }

    // Navbar aa gaya -> ab login/logout UI set karo
    updateAuthUI(currentUser);
}

// window.onload ki jagah addEventListener (doosri scripts ise overwrite nahi karengi)
setupNetlifyIdentity();
document.addEventListener('DOMContentLoaded', includeHTML);