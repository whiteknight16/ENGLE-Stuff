import React, { useEffect, useState } from "react";
import {
  addDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase.config";
import FaviouriteButton from "./FaviouriteButton";

// This componet renders all stories and allows to add new one
function Story() {
  const storyRef = collection(db, "story"); //(db,collectionName)

  const [story, setStory] = useState("");
  const [stories, setStories] = useState([]);

  useEffect(() => {
    // Fetching all stories from the database
    const getAllStories = async () => {
      try {
        const querySnapshot = await getDocs(storyRef);
        // Creating a nrw array of objects with id and data
        const storiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // setting it in a state to render it later
        setStories(storiesData);
      } catch (error) {
        console.error("Error getting documents:", error.message);
      }
    };
    getAllStories();
  }, []);

  //   Handles the addition of new stories
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addDoc(storyRef, {
        story: story,
        createdAt: serverTimestamp(),
      });
      setStory(""); // Clear the input field after submitting
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Story</h1>
      {/* Rendering all stories present */}
      {stories.map((story) => (
        <div key={story.id}>
          <p>{story.story}</p>
          <FaviouriteButton itemId={story.id} type="story" />
        </div>
      ))}
      {/* //Form to submit the story */}
      <form onSubmit={handleSubmit}>
        <label>
          Write your story here:
          <input
            type="text"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Story;
