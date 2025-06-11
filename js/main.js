// Add this to your main.js
function handleLogout() {
  // If using Firebase:
  if (typeof firebase !== 'undefined') {
    firebase.auth().signOut().then(() => {
      sessionStorage.clear();
      window.location.href = 'login.html';
    }).catch((error) => {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    });
  } 
  // If using sessionStorage only:
  else {
    sessionStorage.clear();
    window.location.href = 'login.html';
  }
}

// Make the function available globally
window.handleLogout = handleLogout;








// --- Reusable Type Effect Function ---
function setupTypeEffect(elementId, textToType, delayBeforeStart = 0) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element with ID '${elementId}' not found.`);
        return;
    }

    let charIndex = 0;
    const typingSpeed = 100; // milliseconds per character

    function typeChar() {
        if (charIndex < textToType.length) {
            element.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, typingSpeed);
        } else {
            element.style.borderRight = 'none'; // Remove the typing cursor
        }
    }

    // Clear initial content (important if HTML already has text)
    element.textContent = '';
    // Add a temporary typing cursor style if your CSS doesn't handle it
    element.style.borderRight = '3px solid #8854c0'; // Matches your current CSS

    setTimeout(typeChar, delayBeforeStart);
}

// Call the type effect for each heading when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // For "Trending" heading
    setupTypeEffect('dynamicHeading', "Master Your Subjects: Quizzes for High School Academics");

    // For "More Quizzes" heading, you might want a slight delay after the first one finishes
    // or just start it immediately. Let's start it immediately for simplicity.
    setupTypeEffect('dynamicHeading2', "Your Daily Dose of Knowledge");
});

// The old typeEffect code from your previous main.js should be removed.
// Make sure no `document.querySelectorAll('.content h2')` is overwriting them.
