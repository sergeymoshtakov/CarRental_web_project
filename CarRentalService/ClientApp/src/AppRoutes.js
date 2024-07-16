import { Users } from "./components/Users";
import { Home } from "./components/Home";
import { Register } from "./components/Register";
import { Login } from "./components/Login";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/users',
    element: <Users />
   },
   {
    path: '/login',
    element: <Login />
   },
   {
    path: '/register',
    element: <Register />
   },
];

export default AppRoutes;
