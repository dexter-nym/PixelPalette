document.addEventListener("DOMContentLoaded", () => {
  const othersLogo = document.querySelector(".others-logo");
  const othersDrawer = document.querySelector(".others-drawer");

  othersLogo.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevents closing immediately
    othersDrawer.style.display =
      othersDrawer.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (event) => {
    if (
      !othersLogo.contains(event.target) &&
      !othersDrawer.contains(event.target)
    ) {
      othersDrawer.style.display = "none";
    }
  });
});

document
  .querySelector(".img-options a")
  .addEventListener("click", function (e) {
    e.preventDefault();
    const drawer = this.closest(".img-options").querySelector(
      ".img-options-drawer"
    );
    drawer.style.display = drawer.style.display === "block" ? "none" : "block";
  });

// Function to toggle popups
document.addEventListener("DOMContentLoaded", function () {
  // Get triggers and popups
  const loginTrigger = document.getElementById("login-trigger");
  const signupTrigger = document.getElementById("signup-trigger");
  const loginPopup = document.getElementById("loginPopup");
  const signupPopup = document.getElementById("signupPopup");

  // Function to toggle popup visibility
  function togglePopup(popup) {
    if (popup.style.display === "block") {
      popup.style.display = "none"; // Hide the popup if it's already visible
    } else {
      popup.style.display = "block"; // Show the popup if it's hidden
    }
  }

  // Add click event to login trigger
  loginTrigger.addEventListener("click", function () {
    togglePopup(loginPopup); // Toggle login popup
    signupPopup.style.display = "none"; // Hide signup popup if open
  });

  // Add click event to signup trigger
  signupTrigger.addEventListener("click", function () {
    togglePopup(signupPopup); // Toggle signup popup
    loginPopup.style.display = "none"; // Hide login popup if open
  });

  // Close popups when clicking outside the form
  window.addEventListener("click", function (event) {
    if (event.target === loginPopup) {
      loginPopup.style.display = "none"; // Close login popup
    }
    if (event.target === signupPopup) {
      signupPopup.style.display = "none"; // Close signup popup
    }
  });
});
