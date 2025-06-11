  // Ensure Firebase is initialized if this script runs first (auth.js usually does this)
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
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.firestore(); // Get Firestore instance
  let isAdminUser = false; // Flag to store admin status
  let allQuizzes = []; // Store all quizzes fetched from Firestore [NEW]

  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      isAdminUser = idTokenResult.claims.admin === true; // Set the flag
    } else {
      isAdminUser = false;
    }
    // Initial fetch and render when auth state is known
    await fetchAndRenderQuizzes(); // Call new function [MODIFIED]
  });

  // NEW Function: fetchAllQuizzes - Fetches all quizzes once
  async function fetchAllQuizzes() {
      try {
          const snapshot = await db.collection('quizzes')
                                   .orderBy('createdAt', 'desc') // Order by creation date
                                   .get(); // Get all documents
          allQuizzes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Store with ID
          console.log("All quizzes fetched:", allQuizzes);
      } catch (error) {
          console.error("Error fetching all quizzes:", error);
          allQuizzes = []; // Reset on error
      }
  }

  // NEW Function: filterAndRenderQuizzes - Filters and renders based on search term
  async function filterAndRenderQuizzes(searchTerm = '') {
    const trendingQuizzesContainer = document.getElementById('trendingQuizzes');
    if (!trendingQuizzesContainer) return;

    trendingQuizzesContainer.innerHTML = ''; // Clear existing static content
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

    // Filter quizzes based on the search term
    const filteredQuizzes = allQuizzes.filter(quiz => {
        return quiz.title.toLowerCase().includes(lowerCaseSearchTerm);
    });

    if (filteredQuizzes.length === 0) {
      trendingQuizzesContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7);">No quizzes found matching your search.</p>';
      return;
    }

    filteredQuizzes.forEach(quiz => {
      const quizId = quiz.id;

      // Conditionally render the delete button
      const deleteButtonHtml = isAdminUser ?
        `<button class="delete-quiz-btn" onclick="deleteQuiz('${quizId}', event)">
           <span class="material-icons">delete</span>
         </button>` : '';

      const cardHtml = `
        <div class="topic-card">
          <a href="quizzes/Quiz1/render-quiz.html?id=${quizId}" class="topic-card-link">
            <img src="${quiz.imageUrl || 'https://placehold.co/100x100'}" alt="${quiz.title}">
            <h3>${quiz.title}</h3>
            <p>${quiz.activities || 0} activities</p>
          </a>
          ${deleteButtonHtml}
        </div>
      `;
      trendingQuizzesContainer.innerHTML += cardHtml;
    });
  }

  // NEW Function: Handles the overall process of fetching and rendering
  async function fetchAndRenderQuizzes() {
      await fetchAllQuizzes(); // First, fetch all quizzes
      filterAndRenderQuizzes(''); // Then, render them all (no initial filter)
  }

  // --- NEW: Search Bar Functionality ---
  const searchInput = document.querySelector('.search-bar input[type="text"]');
  const searchButton = document.querySelector('.search-bar .search-button');

  // Event listener for typing in the search bar
  searchInput.addEventListener('input', (event) => {
    filterAndRenderQuizzes(event.target.value);
  });

  // Event listener for clicking the search button (optional, as input 'input' handles most cases)
  searchButton.addEventListener('click', () => {
    filterAndRenderQuizzes(searchInput.value);
  });


  // --- EXISTING FUNCTION: deleteQuiz ---
  async function deleteQuiz(quizId, event) {
    event.stopPropagation(); // Prevent the link click event
    event.preventDefault(); // Prevent default link behavior

    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return; // User cancelled
    }

    try {
      await db.collection('quizzes').doc(quizId).delete();
      alert('Quiz deleted successfully!');
      await fetchAndRenderQuizzes(); // Re-fetch and re-render after deletion [MODIFIED]
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert(`Error deleting quiz: ${error.message}`);
    }
  }

  // Make the deleteQuiz function globally accessible
  window.deleteQuiz = deleteQuiz;
