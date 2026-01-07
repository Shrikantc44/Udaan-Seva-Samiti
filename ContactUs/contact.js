const form = document.getElementById('contactForm');
const statusMsg = document.getElementById('statusMsg');

// ✅ Replace this with your Google Apps Script Web App URL
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbz4u5NFW_g5OZwvkWU6NVStduVtgJfKh4z8lMVLP89epunRzfTfee-HSPFtEvEKUQgmFA/exec";

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    help: form.help.value,
    message: form.message.value,
    subscribe: form.subscribe.checked ? "Yes" : "No"
  };

  try {
    const response = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    if(result.result === "success") {
      statusMsg.textContent = "Your message has been sent successfully!";
      form.reset();
    } else {
      statusMsg.style.color = "red";
      statusMsg.textContent = "Error submitting the form. Try again.";
    }
  } catch (error) {
    console.error(error);
    statusMsg.style.color = "red";
    statusMsg.textContent = "Error submitting the form. Try again.";
  }
});
