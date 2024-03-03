import React, { useEffect, useState } from "react";
import {
  addDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase.config";
import FaviouriteButton from "./FaviouriteButton";

// Similar to stroty handels unseen part
function Unseen() {
  const unseenRef = collection(db, "unseen"); //(db,collectionName)

  const [unseen, setUnseen] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    // fetch all unseen from the database
    const getAllUnseen = async () => {
      try {
        const querySnapshot = await getDocs(unseenRef);
        // Creating a nrw array of objects with id and data
        const storiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // setting it in a state to render it later
        setItems(storiesData);
      } catch (error) {
        console.error("Error getting documents:", error.message);
      }
    };
    getAllUnseen();
  }, []);

  //   Handling addition of new data
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addDoc(unseenRef, {
        unseen: unseen,
        createdAt: serverTimestamp(),
      });
      setUnseen(""); // Clear the input field after submitting
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Unseen</h1>
      {/* Rendering all stories present */}
      {items.map((unseen) => (
        <div key={unseen.id}>
          <p>{unseen.unseen}</p>
          {/* // Import before sending this check if user is looged in and id exists */}
          <FaviouriteButton itemId={unseen.id} type="unseen" />
        </div>
      ))}
      {/* //Form to submit the unseen */}
      <form onSubmit={handleSubmit}>
        <label>
          Write your unseen here:
          <input
            type="text"
            value={unseen}
            onChange={(e) => setUnseen(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Unseen;
