//  // ----------login page -------------------
// // Get elements
// const loginBtn = document.getElementById('loginBtn');
// const popup = document.getElementById('popup');
// const closeBtn = document.querySelector('.close-btn');
// const toggleFormLink = document.getElementById('toggleFormLink');
// const formTitle = document.getElementById('formTitle');
// const signupForm = document.getElementById('signupForm');
// const signinForm = document.getElementById('signinForm');
// const resetPasswordForm = document.getElementById('resetPasswordForm'); // New Reset Password form
// const resetPasswordLink = document.querySelector('.reset-password-link'); // Link for Reset Password
// const toggleParagraph = toggleFormLink.parentElement; // Selects the parent paragraph of the toggle link

// // Show popup on button click
// loginBtn.addEventListener('click', () => {
//     popup.style.display = 'flex';
//     showSignUpForm(); // Show Sign Up form by default
// });

// // Close popup when close button is clicked
// closeBtn.addEventListener('click', () => {
//     popup.style.display = 'none';
// });

// // Close popup when clicking outside of it
// window.addEventListener('click', (event) => {
//     if (event.target === popup) {
//         popup.style.display = 'none';
//     }
// });

// // Function to display Sign Up form
// function showSignUpForm() {
//     signupForm.style.display = 'block';
//     signinForm.style.display = 'none';
//     resetPasswordForm.style.display = 'none'; // Hide Reset Password form
//     formTitle.textContent = 'Sign Up';
//     toggleParagraph.innerHTML = 'Already have an account? <a href="#" id="toggleFormLink">Sign in</a>'; // Update paragraph for Sign Up form
//     updateToggleLink(); // Ensure the event listener is re-attached
// }

// // Function to display Sign In form
// function showSignInForm() {
//     signupForm.style.display = 'none';
//     signinForm.style.display = 'block';
//     resetPasswordForm.style.display = 'none'; // Hide Reset Password form
//     formTitle.textContent = 'Sign In';
//     toggleParagraph.innerHTML = 'Don\'t have an account? <a href="#" id="toggleFormLink">Sign up</a>'; // Update paragraph for Sign In form
//     updateToggleLink(); // Ensure the event listener is re-attached
// }

// // Function to display Reset Password form
// function showResetPasswordForm() {
//     signupForm.style.display = 'none'; // Hide Sign Up form
//     signinForm.style.display = 'none'; // Hide Sign In form
//     resetPasswordForm.style.display = 'block'; // Show Reset Password form
//     formTitle.textContent = 'Reset Password'; // Update form title
// }

// // <!-- ----------------------- sign up form validation   ------------------ -->
//   document.getElementById("signupForm").addEventListener("submit", function(event) {
//       event.preventDefault(); // Form submit hone se rokna hai taaki message dikh sake

//       let name = document.getElementById("signupName").value; // Get name input
//       let email = document.getElementById("signupEmail").value;
//       let password = document.getElementById("password").value;
//       let confirmPassword = document.getElementById("confirm_password").value;
//       let passwordError = document.getElementById("passwordError");
//       let confirmPasswordError = document.getElementById("confirmPasswordError");
//       let successMessage = document.getElementById("successMessage");

//       let passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//       passwordError.textContent = "";
//       confirmPasswordError.textContent = "";
//       successMessage.style.display = "none"; // Har bar submit pe message hide karna hai

//       // Password validation
//       if (!passwordPattern.test(password)) {
//           passwordError.textContent = "Password must be at least 8 characters, include an uppercase, lowercase, number, and special character.";
//           return;
//       }

//       // Confirm password validation
//       if (password !== confirmPassword) {
//           confirmPasswordError.textContent = "Passwords do not match!";
//           return;
//       }

//       // Agar sab kuch sahi hai to success message dikhayein
//       successMessage.style.display = "block";

//       // Storing name, email & password in localStorage for Signin verification
//       localStorage.setItem("savedName", name);
//       localStorage.setItem("savedEmail", email);
//       localStorage.setItem("savedPassword", password);

//       //Reset Form
//       document.getElementById("signupForm").reset(); // Form clear karna

//       // Yaha pe aap actual backend ke saath integration kar sakte hain (like sending data to server)
//   });


//   // ------------------ SIGNIN FORM VALIDATION ------------------
// document.getElementById("signinForm").addEventListener("submit", function(event) {
// event.preventDefault();

// let enteredEmail = document.getElementById("signinEmail").value;
// let enteredPassword = document.getElementById("signinPassword").value;
// let signinError = document.getElementById("signinError");
// let signinSuccess = document.getElementById("signinMessage");

// signinError.style.display = "none";
// signinSuccess.style.display = "none";

// let savedName = localStorage.getItem("savedName");
// let savedEmail = localStorage.getItem("savedEmail");
// let savedPassword = localStorage.getItem("savedPassword");

// // Checking if entered credentials match stored credentials
// if (enteredEmail === savedEmail && enteredPassword === savedPassword) {
//     signinSuccess.style.display = "block";

//      // Update login button to show user's name
//      document.getElementById("loginBtn").textContent = savedName;

//      // Show logout button but keep it hidden initially
//      document.getElementById("logoutButton").style.display = "none";
  
// } else {
//     signinError.style.display = "block";
// }

// //Reset Form
// document.getElementById("signinForm").reset(); // Form clear karna
// });

// // ------------------ TOGGLE LOGOUT BUTTON ------------------
// document.getElementById("loginBtn").addEventListener("click", function() {
//   let logoutButton = document.getElementById("logoutButton");
  
//   // Only toggle logout if user is logged in
//   if (localStorage.getItem("savedName")) {
//       if (logoutButton.style.display === "none" || logoutButton.style.display === "") {
//           logoutButton.style.display = "block";
//       } else {
//           logoutButton.style.display = "none";
//       }
//   }
// });

// // ------------------ LOGOUT FUNCTION ------------------
// document.getElementById("logoutButton").addEventListener("click", function() {
// // Remove user data from localStorage
// localStorage.removeItem("savedName");
// localStorage.removeItem("savedEmail");
// localStorage.removeItem("savedPassword");

// // Reset login button text
// document.getElementById("loginBtn").textContent = "Login";

// // Hide logout button
// document.getElementById("logoutButton").style.display = "none";
// });