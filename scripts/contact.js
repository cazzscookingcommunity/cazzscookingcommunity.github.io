document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const formContainer = document.getElementById("formContainer");
  const successContainer = document.getElementById("successContainer");
  const recipeUrlInput = document.getElementById("modal-recipe-url");

  // 1. DYNAMICALLY CAPTURE THE PARENT PAGE URL
  // Reads '?recipe=https://...' from the address bar of this popup window
  const urlParams = new URLSearchParams(window.location.search);
  const parentRecipeUrl = urlParams.get('recipe');
  
  if (recipeUrlInput && parentRecipeUrl) {
    recipeUrlInput.value = parentRecipeUrl;
  }

  // 2. HANDLE SUBMISSION
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Keep window open to show thanks

      const submitBtn = contactForm.querySelector(".contact-btn");
      if (submitBtn) {
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;
      }

      // Send form data in the background
      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "Accept": "application/json" }
      })
        .then(response => {
        // Hide the form container, show the thanks message
        if (formContainer) formContainer.classList.add("hidden-element");
        if (successContainer) successContainer.classList.remove("hidden-element");

        // 3. ACTUAL LITERAL WINDOW CLOSE
        // Destroys/closes this browser popup window after 7 seconds
        setTimeout(() => {
          window.close();
        }, 7000);
      })
      .catch(error => {
        alert("Oops! There was a problem sending your message. Please try again.");
        if (submitBtn) {
          submitBtn.textContent = "Send Message";
          submitBtn.disabled = false;
        }
      });
    });
  }
});