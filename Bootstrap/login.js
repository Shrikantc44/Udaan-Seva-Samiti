// Netlify Identity Initialize
netlifyIdentity.init();

// Form toggle logic (Sign In vs Sign Up)
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

// Password visibility toggle
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggleIcon = field.parentElement.querySelector('.toggle-password');
    
    if (field.type === 'password') {
        field.type = 'text';
        toggleIcon.textContent = '👁️';
    } else {
        field.type = 'password';
        toggleIcon.textContent = '👁';
    }
}

// Google Login Trigger
document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
    netlifyIdentity.open('login'); 
});

// Form Submit Logic
document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const mode = document.getElementById('formTitle').textContent;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (mode === 'Sign Up') {
        const fullName = document.getElementById('fullName').value.trim();
        const contact = document.getElementById('contact').value.trim();
        const confirmPass = document.getElementById('confirmPassword').value;

        // Validation
        if (!fullName || !email || !password || !confirmPass) {
            alert("Please fill all required fields!");
            return;
        }
        
        if (password !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }
        
        if (password.length < 6) {
            alert("Password must be at least 6 characters long!");
            return;
        }

        // Show loading state
        const submitBtn = document.getElementById('submitButton');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Registering...';
        submitBtn.disabled = true;

        // Registration Logic
        netlifyIdentity.gotrue.signup(email, password, { 
            full_name: fullName, 
            user_metadata: { 
                contact_number: contact,
                full_name: fullName 
            } 
        }).then(
            (response) => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                alert("Registration Successful! Please check your email to confirm your account.");
                
                // Auto switch to login form after successful registration
                toggleForm();
                
                // Clear form
                document.getElementById('authForm').reset();
            },
            (error) => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                alert("Signup Error: " + error.message);
            }
        );

    } else {
        // Login Logic
        if (!email || !password) {
            alert("Please enter email and password!");
            return;
        }

        // Show loading state
        const submitBtn = document.getElementById('submitButton');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        netlifyIdentity.gotrue.login(email, password, true).then(
            (user) => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Save login state to localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', user.user_metadata?.full_name || user.email);
                
                // Redirect to dashboard
                window.location.href = "/dashboard.html"; 
            },
            (err) => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                alert("Login failed: " + err.message);
            }   
        );
    }
});

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        netlifyIdentity.currentUser()?.then(user => {
            if (user) {
                // User is already logged in, redirect to dashboard
                window.location.href = "/dashboard.html";
            }
        });
    }
    
    // Handle Netlify Identity events
    netlifyIdentity.on('login', (user) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', user.user_metadata?.full_name || user.email);
        window.location.href = "/dashboard.html";
    });
});