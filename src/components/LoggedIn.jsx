import React, { useState, useEffect } from "react";
import { auth } from "../config/firebase.config";

// Just a basic componet ot check if user is logged in or not
function LoggedIn() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user ? user.displayName : null);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {currentUser ? (
        <div>You are logged in as {currentUser} </div>
      ) : (
        <div>You are not logged in</div>
      )}
    </div>
  );
}

export default LoggedIn;
