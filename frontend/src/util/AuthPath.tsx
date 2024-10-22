import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AuthPath() {
	const navigate = useNavigate();
	useEffect(() => {
		const Token = window.localStorage.getItem("Token");
		if (!Token) {
            navigate("/");
		}
	}, []);
	return (
		<>
			<Outlet />
		</>
	);
}
