import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAy-nED7vT7p2aS1jaO0u2Ln26Ijz2o9YY",
  authDomain: "svf-chat.firebaseapp.com",
  projectId: "svf-chat",
  storageBucket: "svf-chat.firebasestorage.app",
  messagingSenderId: "537232518574",
  appId: "1:537232518574:web:5f85218e8bb6fa77e92c3f",
  measurementId: "G-3TYQYVT923",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

if (window.location.pathname === "/index.html") {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const signUpBtn = document.getElementById("signUpBtn");
  const signInBtn = document.getElementById("signInBtn");
  const signOutBtn = document.getElementById("hero-logout");
  const login = document.getElementById("login");
  const heroLogout = document.getElementById("hero-logout");
  const heroLogin = document.getElementById("hero-login");
  const heroJoin = document.getElementById("hero-join");
  const closeModal = document.getElementById("closeModal");

  login.style.display = "none";
  heroLogout.style.display = "none";
  signUpBtn.style.display = "none";
  signInBtn.style.display = "none";

  const userSignUp = async () => {
    const signUpEmail = email.value;
    const signUpPassword = password.value;
    createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
      .then((userCreditional) => {
        const user = userCreditional.user;
        console.log(user);
        login.style.display = "none";
        heroLogout.style.display = "flex";
        heroLogin.style.display = "none";
        heroJoin.style.display = "none";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode.includes("auth/email-already-in-use")) {
          alert("Email already in use, try another email.");
        } else if (errorCode.includes("auth/invalid-email")) {
          alert("Invalid email, try again.");
        }
      });
  };

  const userSignIn = async () => {
    const signInEmail = email.value;
    const signInPassword = password.value;
    signInWithEmailAndPassword(auth, signInEmail, signInPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        login.style.display = "none";
        heroLogout.style.display = "flex";
        heroLogin.style.display = "none";
        heroJoin.style.display = "none";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        alert("Invalid email or password, try again.");
      });
  };

  const checkAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        login.style.display = "none";
        heroLogout.style.display = "flex";
        heroLogin.style.display = "none";
        heroJoin.style.display = "none";
      } else {
        login.style.display = "none";
        heroLogout.style.display = "none";
        heroLogin.style.display = "flex";
        heroJoin.style.display = "flex";
        signInBtn.style.display = "none";
        signUpBtn.style.display = "none";
      }
    });
  };

  checkAuthState();

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        heroJoin.style.display = "flex";
        heroLogin.style.display = "flex";
        heroLogout.style.display = "none";
        login.style.display = "none";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };

  heroLogin.addEventListener("click", () => {
    login.style.display = "block";
    signInBtn.style.display = "block";
    signUpBtn.style.display = "none";
  });
  heroJoin.addEventListener("click", () => {
    login.style.display = "block";
    signUpBtn.style.display = "block";
    signInBtn.style.display = "none";
  });
  heroLogout.addEventListener("click", () => {
    login.style.display = "none";
    heroJoin.style.display = "flex";
    heroLogin.style.display = "flex";
    signInBtn.style.display = "none";
    signUpBtn.style.display = "none";
  });

  signUpBtn.addEventListener("click", userSignUp);
  signInBtn.addEventListener("click", userSignIn);
  signOutBtn.addEventListener("click", userSignOut);
  closeModal.addEventListener("click", () => {
    login.style.display = "none";
    signInBtn.style.display = "none";
    signUpBtn.style.display = "none";
  });
} else if (window.location.pathname === "/chat.html") {
  const loggedUser = document.getElementById("chat-logged-user");
  loggedUser.style.display = "none";

  const checkAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        loggedUser.style.display = "block";
        loggedUser.innerText = user.email;
        localStorage.setItem("logged-user", user.email);
      } else {
        loggedUser.style.display = "none";
        loggedUser.innerText = "";
        localStorage.removeItem("logged-user");
      }
    });
  };

  checkAuthState();
}
