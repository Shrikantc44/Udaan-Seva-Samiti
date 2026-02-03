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

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    field.type = field.type === 'password' ? 'text' : 'password';
}

// Google External Login Logic
document.getElementById('googleLoginBtn').addEventListener('click', () => {
    netlifyIdentity.loginExternal('google');
});

// Netlify Identity Logic for Email/Password
document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const mode = document.getElementById('formTitle').textContent;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (mode === 'Sign Up') {
        const fullName = document.getElementById('fullName').value;
        const contact = document.getElementById('contact').value;
        const confirmPass = document.getElementById('confirmPassword').value;

        if (password !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }

        netlifyIdentity.signup(email, password, { 
            full_name: fullName, 
            data: { contact: contact } // Updated metadata structure
        }).then(
            (user) => {
                alert("Registration successful! Please check your email for confirmation.");
                toggleForm();
            },
            (err) => alert("Error: " + err.message)
        );

    } else {
        netlifyIdentity.login(email, password).then(
            (user) => {
                alert("Login successful!");
                window.location.href = "/index.html";
            },
            (err) => alert("Login failed: " + err.message)
        );
    }
});