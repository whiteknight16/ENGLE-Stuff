import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase.config";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  setDoc,
  arrayRemove,
} from "firebase/firestore";
function FaviouriteButton({ itemId, type }) {
  // Setting up all the states
  const [isFavourite, setIsFavourite] = useState();
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // It is the function to fetch the state of favourite button
  const fetchFavourite = async () => {
    if (userId) {
      const docRef = doc(db, "favourite", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const itemInArray = data[type].find((item) => item.itemId === itemId);
        // Setting the isFavourite state depending of wheter it is favoutite and its data present in db or not
        if (itemInArray) {
          setIsFavourite(true);
        } else {
          setIsFavourite(false);
        }
      } else {
        setIsFavourite(false);
      }
    }
  };
  useEffect(() => {
    fetchFavourite();
    setIsLoading(false);
  }, [userId, type, itemId]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        if (!authUser) {
          throw new Error("No user");
        }
        setUserId(authUser.uid);
      } else {
        // User is signed out
        setUserId(null);
      }
    });

    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe();
    };
  }, []);

  // Function to handle the click of the button
  const handleClick = async () => {
    const docRef = doc(db, "favourite", userId);

    if (!isFavourite) {
      //it is the object to be added
      const obj = {
        itemId,
        createdAt: new Date(),
        isFavourite: true,
      };
      // Check if the document exists
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // If the document exists, update the type array
        await updateDoc(docRef, {
          [type]: arrayUnion(obj),
        });
      } else {
        // If the document does not exist, create it and add obj to array
        await setDoc(docRef, {
          [type]: [obj],
        });
      }
      fetchFavourite();
    }

    if (isFavourite) {
      //Object ot be removed
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const newArray = data[type].filter((item) => item.itemId !== itemId);

        await updateDoc(docRef, {
          [type]: newArray,
        });
      }
      setIsFavourite(false);
    }
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <button onClick={handleClick}>
        {isFavourite ? "Remove from favourite" : "Add to favourite"}
      </button>
    </div>
  );
}

export default FaviouriteButton;
