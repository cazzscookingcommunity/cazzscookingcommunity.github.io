document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const formContainer = document.getElementById("formContainer");
  const successContainer = document.getElementById("successContainer");
  const popup = document.getElementById("contactPopup");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Stop the page from reloading/redirecting

      const submitBtn = contactForm.querySelector(".contact-btn");
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      // Send the data in the background
      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "Accept": "application/json" }
      })
      .then(response => {
        // ON SUCCESS: 
        
        // 1. Instantly hide the form layout
        formContainer.classList.add("hidden-element");
        
        // 2. Instantly display the thanks message
        successContainer.classList.remove("hidden-element");

        // 3. Start the clock to close the window 15 seconds from now
        setTimeout(() => {
          popup.style.display = "none";
        }, 7000);
      })
      .catch(error => {
        alert("Oops! There was a problem sending your message. Please try again.");
        submitBtn.textContent = "Send Message";
        submitBtn.disabled = false;
      });
    });
  }
});