import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Schedule from "./components/Schedule";
import Payroll from "./components/Payroll";
import Employees from "./components/Employees";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: "/register",
    element: <Signup />,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: "/schedule",
    element: <Schedule />,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: "/payroll",
    element: <Payroll />,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: "/employees",
    element: <Employees />,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: "*",
    element: <div>404 Not Found</div>
  }
], {
  basename: "/mymoney",
});

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
