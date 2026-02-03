// Toggle Form functionality
function toggleForm() {
    const mode = document.getElementById('formTitle');
    const signupFields = document.getElementById('signupFields');
    const confirmPasswordField = document.getElementById('confirmPasswordField');
    const toggleText = document.getElementById('toggleText');
    const button = document.getElementById('submitButton');

    if (mode.textContent === 'Sign In') {
        mode.textContent = 'Sign Up';
        signupFields.classList.remove('hidden');
        confirmPasswordField.classList.remove('hidden');
        toggleText.innerHTML = "Already have an account? <a href='#' onclick='toggleForm()'>Sign in</a>";
        button.textContent = 'Register';
    } else {
        mode.textContent = 'Sign In';
        signupFields.classList.add('hidden');
        confirmPasswordField.classList.add('hidden');
        toggleText.innerHTML = "Don't have an account? <a href='#' onclick='toggleForm()'>Sign up</a>";
        button.textContent = 'Sign In';
    }
}

// Netlify Logic
document.addEventListener("DOMContentLoaded", () => {
    // 1. Google Login Fix
    document.getElementById('googleLoginBtn').addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Google Login Triggered");
        netlifyIdentity.loginExternal('google');
    });

    // 2. Auth Form (Email/Pass) Fix
    document.getElementById('authForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const mode = document.getElementById('formTitle').textContent;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (mode === 'Sign Up') {
            const fullName = document.getElementById('fullName').value;
            const confirmPass = document.getElementById('confirmPassword').value;

            if (password !== confirmPass) { alert("Passwords don't match!"); return; }

            netlifyIdentity.signup(email, password, { full_name: fullName })
                .then(() => alert("Verification email sent! Check your inbox."))
                .catch(err => alert("Signup error: " + err.message));
        } else {
            netlifyIdentity.login(email, password)
                .then(() => window.location.href = "/index.html")
                .catch(err => alert("Login error: " + err.message));
        }
    });
});