import { createBrowserRouter } from "react-router-dom"
import Layout from "../Layout"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Logout from "../pages/Logout"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import TaskLists from "../pages/TaskLists"
import UserProfile from "../pages/UserProfile"
import ProtectedRoute from "../components/ProtectedRoute"
import Tasks from "../pages/Tasks"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
     { 
      element: <ProtectedRoute />, 
      children: [ 
        { path: "dashboard", element: <Dashboard /> },
        { path: "logout", element: <Logout /> },
        { path: "tasklists", element: <TaskLists /> },
        { path: "tasks/:id", element: <Tasks /> },
        { path: "userprofile", element: <UserProfile /> }
         // add more protected routes here later
     ] }
    ]
  }
])
