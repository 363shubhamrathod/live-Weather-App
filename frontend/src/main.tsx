import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WeatherCard from "./compnents/WeatherCard.tsx";
import Signup from "./compnents/Signup.tsx";
import Login from "./compnents/Login.tsx";
import NotAuthPath from "./util/NotAuthPath.tsx";
import AuthPath from "./util/AuthPath.tsx";
import AlertForm from "./compnents/AlertForm.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "",
				element: <NotAuthPath />,
				children: [
					{ path: "", element: <WeatherCard /> },
					{ path: "/signup", element: <Signup /> },
					{ path: "/login", element: <Login /> },
				],
			},
			{
				path: "authentcated",
				element: <AuthPath />,
				children: [{ path: "", element: <WeatherCard /> },{
                    path:"alert",element:<AlertForm/>
                }],
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
