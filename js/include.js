// js/include.js

async function includeHTML() {
    const components = [
        
        { id: 'navbar-placeholder', url: '/components/navbar.html' },
        { id: 'footer-placeholder', url: '/components/footer.html' }
    ];

    for (const component of components) {
        const element = document.getElementById(component.id);
        if (element) {
            try {
                // fetch के पाथ को absolute बनाया गया है
                const response = await fetch(component.url);
                if (!response.ok) throw new Error("File not found");
                const data = await response.text();
                element.innerHTML = data;
            } catch (error) {
                console.error(`Error loading ${component.url}:`, error);
            }
        }
    }

    // --- Navbar लोड होने के बाद Netlify Identity Logic शुरू करें ---
    setupNetlifyIdentity();
}

function setupNetlifyIdentity() {
    // अगर Netlify की स्क्रिप्ट HTML में नहीं है, तो रुक जाएं
    if (typeof netlifyIdentity === 'undefined') {
        console.warn("Netlify Identity widget not found");
        return;
    }

    netlifyIdentity.init();

    const updateUI = (user) => {
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
            if (loginLi) loginLi.style.display = 'block';
            if (logoutLi) logoutLi.style.display = 'none';
        }
    };

    netlifyIdentity.on('init', user => updateUI(user));
    netlifyIdentity.on('login', user => {
        updateUI(user);
        netlifyIdentity.close();
        window.location.href = "/dashboard.html";
    });
    netlifyIdentity.on('logout', () => {
        updateUI(null);
        window.location.href = "/index.html";
    });

    // Logout बटन के लिए Event Delegation
    document.addEventListener('click', (e) => {
        if (e.target.closest('#logoutBtn')) {
            e.preventDefault();
            netlifyIdentity.logout();
        }
    });
}

// ensure the script runs
window.onload = includeHTML;

// मोबाइल मेनू फंक्शन
function toggleMenu() {
    const menu = document.querySelector('.menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}