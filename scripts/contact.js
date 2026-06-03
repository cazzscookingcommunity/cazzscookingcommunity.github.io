// 1. The Open Function called by your page action icon: onclick="openContactPopup(window.location.href)"
function openContactPopup(currentUrl) {
  const popup = document.getElementById("contactPopup");
  const formContainer = document.getElementById("formContainer");
  const successContainer = document.getElementById("successContainer");
  const recipeUrlInput = document.getElementById("modal-recipe-url");
  const contactForm = document.getElementById("contactForm");

  if (popup) {
    // Reset views back to default form state (in case they open it a second time)
    formContainer.classList.remove("hidden-element");
    successContainer.classList.add("hidden-element");
    
    if (contactForm) {
      contactForm.reset();
      const submitBtn = contactForm.querySelector(".contact-btn");
      if (submitBtn) {
        submitBtn.textContent = "Send Message";
        submitBtn.disabled = false;
      }
    }

    // Inject the current recipe URL into the hidden form field
    if (recipeUrlInput) {
      recipeUrlInput.value = currentUrl;
    }

    // "Open" the window by making it visible
    popup.style.display = "block";
  }
}

// 2. The Optional Close Function for the "X" button
function closeContactPopup() {
  const popup = document.getElementById("contactPopup");
  if (popup) {
    popup.style.display = "none";
  }
}

// 3. Handle the submission, background fetch, and 15-second timer
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const formContainer = document.getElementById("formContainer");
  const successContainer = document.getElementById("successContainer");
  const popup = document.getElementById("contactPopup");

  // Close popup if the user clicks the dark background overlay outside the box
  window.addEventListener("click", (event) => {
    if (event.target === popup) {
      closeContactPopup();
    }
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Stop page from redirecting

      const submitBtn = contactForm.querySelector(".contact-btn");
      if (submitBtn) {
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;
      }

      // Send the form data in the background
      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "Accept": "application/json" }
      })
      .then(response => {
        // ON SUCCESS:
        
        // Hide the form layout row
        formContainer.classList.add("hidden-element");
        
        // Display the thanks message container
        successContainer.classList.remove("hidden-element");

        // Start the clock to self-close the window 7 seconds from click
        setTimeout(() => {
          popup.style.display = "none";
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