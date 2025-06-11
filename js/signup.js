async function handleSignupSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return false;
    }

    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      // The onAuthStateChanged listener in auth.js will handle redirection and sessionStorage
      // window.location.href = 'index.html'; // This line is now handled by auth.js
    } catch (error) {
      alert(error.message);
    }
    return false;
  }