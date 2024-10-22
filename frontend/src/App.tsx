import { Outlet, useLocation, useNavigate } from "react-router-dom";

function App() {
	const location = useLocation();
	const navigate = useNavigate();
	function handleClick() {
		if (location.pathname == "/authentcated") {
			window.localStorage.removeItem("Token");
			navigate("/");
		} else {
			navigate("/login");
		}
	}
	return (
		<div
			style={{
				backgroundImage: "url('/background.avif')", // Use a local or online GIF
				backgroundSize: "cover", // Make sure the background covers the entire div
				backgroundPosition: "center", // Center the image
				backgroundRepeat: "no-repeat", // Prevent the background from repeating
				width: "100%", // Make it take the full viewport width
				minHeight: "100vh", // Make it take the full viewport height
			}}
		>
			<div style={{ display: "flex", justifyContent: "flex-end" }}>
				<button
					style={{
						padding: "1rem",
						margin: "1rem",
						borderRadius: "2rem",
						backgroundColor: "rgba(0, 0, 0, 0.1)",
					}}
					onClick={handleClick}
				>
					{location.pathname == "/authentcated" ||
					location.pathname == "/authentcated/alert"
						? "Logout"
						: "Login"}
				</button>
				{location.pathname == "/authentcated" && (
					<button
						style={{
							padding: "1rem",
							margin: "1rem",
							borderRadius: "2rem",
							backgroundColor: "rgba(0, 0, 0, 0.1)",
						}}
						onClick={()=>{navigate("/authentcated/alert")}}
					>Add Alert</button>
				)}
			</div>
			<div
				style={{
					alignItems: "center",
					justifyContent: "center",
					display: "flex",
					alignContent: "center",
					minHeight: "90vh",
				}}
			>
				<div
					style={{
						backgroundColor: "rgba(0, 0, 0, 0.1)", // Transparent black with 50% opacity
						padding: "20px", // Optional padding for the inner div
						borderRadius: "8px", // Optional rounded corners for the inner div
						color: "#fff", // Text color to contrast with the dark background
						minWidth: "50%",
					}}
				>
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default App;
