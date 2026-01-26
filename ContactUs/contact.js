const form = document.getElementById("contactForm");
const statusMsg = document.getElementById("statusMsg");

// 👇 NEW Google Apps Script URL
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyGtLj0d3MkOiJuQjr6RosbElXihHzuCjYyB24tPrwgX7JblbcLAFXruf3xoQV1s69myg/exec";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", form.name.value);
  formData.append("email", form.email.value);
  formData.append("phone", form.phone.value);
  formData.append("help", form.help.value);
  formData.append("message", form.message.value);
  formData.append("subscribe", form.subscribe.checked ? "Yes" : "No");

  try {
    const res = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      body: formData
    });

    const text = await res.text();

    if (text === "success") {
      statusMsg.style.color = "green";
      statusMsg.innerText = "Message sent successfully!";
      form.reset();
    } else {
      throw new Error("Sheet error");
    }

  } catch (err) {
    console.error(err);
    statusMsg.style.color = "red";
    statusMsg.innerText =
      "Something went wrong. Please try again.";
  }
});
