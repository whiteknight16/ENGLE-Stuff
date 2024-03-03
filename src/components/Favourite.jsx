import React, { useState, useEffect } from "react";
import { auth, db } from "../config/firebase.config";
import {
  collection,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import FaviouriteButton from "./FaviouriteButton";

function Favourite() {
  //Setting up states
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  //   function to fetch data from the database
  const fetchAllData = async (userId) => {
    const docRef = doc(db, "favourite", userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // If the document does not exist, return "No favourite"
      return <div>No favourite</div>;
    } else {
      // If the document exists, return the data
      const favouriteItems = [];

      //   for loop to traverse over various items in the document
      for (let key in docSnap.data()) {
        const values = docSnap.data()[key];
        const collectionRef = collection(db, key);

        // To set all favourite items into the data state, you should call setData
        // after all the promises from getDoc have resolved.
        // This is because getDoc is an asynchronous operation and returns a promise.
        // You can use Promise.all to wait for all promises to resolve.
        const promises = values.map((value) => {
          const createdAt = Timestamp.fromMillis(
            value.createdAt.seconds * 1000 +
              value.createdAt.nanoseconds / 1000000
          ).toDate();
          const itemDocRef = doc(collectionRef, value.itemId);
          return getDoc(itemDocRef).then((itemDocSnap) => {
            if (itemDocSnap.exists()) {
              //Structure of final object
              // {
              //     data: The contents,
              //     createdAt: The time it was added,
              //     type: The type of the item
              // id:value.itemId
              // }
              const final_object = {
                data: itemDocSnap.data()[key],
                createdAt: createdAt,
                type: key,
                id: value.itemId,
              };

              favouriteItems.push(final_object);
            } else {
              console.log("No such document");
            }
          });
        });

        Promise.all(promises).then(() => {
          setData(favouriteItems);
        });
      }
    }
  };

  //   useEffect hook to get the userId of currently logged in user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        if (!authUser) {
          throw new Error("No user");
        }
        setUserId(authUser.uid);
        fetchAllData(authUser.uid).then(() => {
          setLoading(false);
        });
      } else {
        // User is signed out
        setUserId(null);
        setLoading(false);
      }
    }, []);

    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe();
    };
  }, []);

  const removeFromFavourite = async (itemId, type) => {
    const docRef = doc(db, "favourite", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const newArray = data[type].filter((item) => item.itemId !== itemId);

      await updateDoc(docRef, {
        [type]: newArray,
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  if (data.length === 0) return <div>No favourite</div>;

  return (
    <div>
      {console.log(data)}
      <h1>Favourite</h1>
      {data.map((item, indx) => (
        <div key={indx}>
          <h1>{indx + 1}</h1>
          <p>{item.data}</p>
          <p>
            {item.createdAt.toLocaleDateString()}
            {item.createdAt.toLocaleTimeString()}
          </p>
          <p>{item.type}</p>
          <button onClick={() => removeFromFavourite(item.id, item.type)}>
            Remove From Favourite
          </button>
        </div>
      ))}
    </div>
  );
}

export default Favourite;
