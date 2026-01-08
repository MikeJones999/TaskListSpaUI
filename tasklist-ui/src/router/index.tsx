import React from "react"
import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import Home from "../pages/Home"
// import Login from "../pages/Login"
// import Register from "../pages/Register"
// import Dashboard from "../pages/Dashboard"
// import TaskLists from "../pages/TaskLists"
// import TaskListDetail from "../pages/TaskListDetail"
// import UserProfile from "../pages/UserProfile"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
    //   { path: "login", element: <Login /> },
    //   { path: "register", element: <Register /> },
    //   { path: "dashboard", element: <Dashboard /> },
    //   { path: "tasklists", element: <TaskLists /> },
    //   { path: "tasklists/:id", element: <TaskListDetail /> },
    //   { path: "profile", element: <UserProfile /> }
    ]
  }
])
