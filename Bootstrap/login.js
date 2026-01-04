function toggleForm() {
  const mode = document.getElementById('formTitle');
  const signupFields = document.getElementById('signupFields');
  const confirmPasswordField = document.getElementById('confirmPasswordField');
  const resetLink = document.getElementById('resetPassword');
  const toggleText = document.getElementById('toggleText');
  const button = document.getElementById('submitButton');

  if (mode.textContent === 'Sign In') {
    mode.textContent = 'Sign Up';
    signupFields.classList.remove('hidden');
    confirmPasswordField.classList.remove('hidden');
    resetLink.style.display = 'none';
    toggleText.innerHTML = "Already have an account? <a href='#' onclick='toggleForm()'>Sign in</a>";
    button.textContent = 'Register';
  } else {
    mode.textContent = 'Sign In';
    signupFields.classList.add('hidden');
    confirmPasswordField.classList.add('hidden');
    resetLink.style.display = 'inline-block';
    toggleText.innerHTML = "Don't have an account? <a href='#' onclick='toggleForm()'>Sign up</a>";
    button.textContent = 'Sign In';
  }
}

function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  field.type = field.type === 'password' ? 'text' : 'password';
}

document.getElementById('authForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const mode = document.getElementById('formTitle').textContent;
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const fullName = document.getElementById('fullName');
  const contact = document.getElementById('contact');
  let isValid = true;

  if (!email.value.includes('@')) {
    alert("Please enter a valid email.");
    isValid = false;
  }
  if (password.value.length < 6) {
    alert("Password must be at least 6 characters.");
    isValid = false;
  }
  if (mode === 'Sign Up') {
    if (!fullName.value || !contact.value) {
      alert("Please fill all required fields.");
      isValid = false;
    }
    if (password.value !== confirmPassword.value) {
      alert("Passwords do not match.");
      isValid = false;
    }
  }

  if (isValid) {
    alert(`${mode} successful!`);
    this.reset();
  }
});