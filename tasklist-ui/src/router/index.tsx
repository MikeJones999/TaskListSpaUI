import { createBrowserRouter } from "react-router-dom"
import Layout from "../Layout"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Logout from "../pages/Logout"
// import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import TaskLists from "../pages/TaskLists"
// import TaskListDetail from "../pages/TaskListDetail"
// import UserProfile from "../pages/UserProfile"
import ProtectedRoute from "../components/ProtectedRoute"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
    //   { path: "register", element: <Register /> },
     { 
      element: <ProtectedRoute />, 
      children: [ 
        { path: "dashboard", element: <Dashboard /> },
        { path: "logout", element: <Logout /> },
        { path: "tasklists", element: <TaskLists /> }
         // add more protected routes here later
     ] }
    //   ,
    //   { path: "tasklists/:id", element: <TaskListDetail /> },
    //   { path: "profile", element: <UserProfile /> }
    ]
  }
])
