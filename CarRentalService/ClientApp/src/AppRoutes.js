import { Users } from "./components/Users";
import { Home } from "./components/Home";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { SearchCars } from "./components/SearchCars";
import { MyRentals } from "./components/MyRentals";
import { Countries } from "./components/Countries";
import { Cities } from "./components/Cities";
import { Cars } from "./components/Cars";

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
    {
        path: '/search-cars',
        element: <SearchCars />
    },
    {
        path: '/my-rentals',
        element: <MyRentals />
    },
    {
        path: '/cities',
        element: <Cities />
    },
    {
        path: '/countries',
        element: <Countries />
    },
    {
        path: '/cars',
        element: <Cars /> 
    },
];

export default AppRoutes;
