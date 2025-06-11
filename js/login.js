async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      // The onAuthStateChanged listener in auth.js will handle redirection and sessionStorage
      // window.location.href = 'index.html'; // This line is now handled by auth.js
    } catch (error) {
      alert(error.message);
    }
    return false;
  }

  function handleSignup() {
    window.location.href = 'signup.html';
  }

  // Sparkle effect (keep as is)
  function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.animationDelay = Math.random() * 0.1 + 's';
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 3000);
  }

  setInterval(createSparkle, 300);