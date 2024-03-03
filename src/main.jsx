import React from "react";
import ReactDOM from "react-dom/client";

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

//Importing Diffrent Components
import LoginComponent from "./components/LoginComponent";
import LoggedIn from "./components/LoggedIn";
import Story from "./components/Story";
import Unseen from "./components/Unseen";
import Favourite from "./components/Favourite";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LoginComponent />}></Route>
      <Route path="/loggedin" element={<LoggedIn />}></Route>
      <Route path="/story" element={<Story />}></Route>
      <Route path="/unseen" element={<Unseen />}></Route>
      <Route path="/favourite" element={<Favourite />}></Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}></RouterProvider>
);
