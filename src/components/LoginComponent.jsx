import React from "react";
import { auth, googleAuthProvider } from "../config/firebase.config";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// This is the LoginComponent it handles the login and logout
function LoginComponent() {
  const navigate = useNavigate();
  //The async function to handle login with the google
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      //   navigate to other route when loggedin
      navigate("/loggedin");
    } catch (error) {
      console.log(error);
    }
  };
  // Handles the logiut functionality
  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("Logged out");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexFlow: "column",
      }}
    >
      <h1>Google Login Component</h1>
      <button onClick={handleLogin}>Click on it to signIn with Google</button>
      <button onClick={handleLogout}>Click on it to signOut with Google</button>
    </div>
  );
}

export default LoginComponent;
