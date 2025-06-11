// auth.js

// Initialize Firebase (keep this as is)
if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyAzx1KvETDa9GBBhCCCd1yaEf4w7v9PAp4",
    authDomain: "quizzer-ad291.firebaseapp.com",
    databaseURL: "https://quizzer-ad291-default-rtdb.firebaseio.com",
    projectId: "quizzer-ad291",
    storageBucket: "quizzer-ad291.firebasestorage.app",
    messagingSenderId: "731021085710",
    appId: "1:731021085710:web:16af2a9d6f160b57d7405f",
    measurementId: "G-4194RW8C20"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

// Function to check admin status based on custom claims
async function checkAdminStatus(user) {
  if (!user) return false;

  try {
    const idTokenResult = await user.getIdTokenResult(true); // Force refresh token to get latest claims
    return idTokenResult.claims.admin === true;
  } catch (error) {
    console.error("Error getting ID token result:", error);
    return false;
  }
}

// Function to update UI based on login and admin status
function updateUI(user) {
  const userEmailDisplay = document.getElementById('userEmailDisplay');
  const createQuizButton = document.getElementById('createQuizButton');

  // Only attempt to update if the elements exist on the current page
  if (userEmailDisplay && createQuizButton) { // Add null checks here
    if (user) {
      userEmailDisplay.textContent = user.email; // Display user email
      checkAdminStatus(user).then(isAdmin => {
        if (isAdmin) {
          createQuizButton.style.display = 'flex'; // Show if admin
        } else {
          createQuizButton.style.display = 'none'; // Hide if not admin
        }
      });
    } else {
      // No user logged in
      userEmailDisplay.textContent = '';
      createQuizButton.style.display = 'none'; // Hide if no user
    }
  }

  // Handle redirects based on authentication state
  const currentPage = window.location.pathname.split('/').pop(); // Get just the filename

  if (user) {
    // User is logged in
    if (currentPage === 'login.html' || currentPage === 'signup.html') {
      // If logged in and on login/signup page, redirect to index
      window.location.href = 'index.html';
    }
  } else {
    // No user logged in
    if (currentPage !== 'login.html' && currentPage !== 'signup.html') {
      // If not logged in and not on login/signup page, redirect to login
      window.location.href = 'login.html';
    }
  }
}

// Listen for authentication state changes
firebase.auth().onAuthStateChanged((user) => {
  updateUI(user);
});