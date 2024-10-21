import WeatherCard from "./compnents/WeatherCard";
function App() {
	return (
		<div
			style={{
				backgroundImage: "url('/background.avif')", // Use a local or online GIF
				backgroundSize: "cover", // Make sure the background covers the entire div
				backgroundPosition: "center", // Center the image
				backgroundRepeat: "no-repeat", // Prevent the background from repeating
				width: "100%", // Make it take the full viewport width
				minHeight: "100vh", // Make it take the full viewport height
				alignItems: "center",
				justifyContent: "center",
				display: "flex",
			}}
		>
			<div
				style={{
					backgroundColor: "rgba(0, 0, 0, 0.1)", // Transparent black with 50% opacity
					padding: "20px", // Optional padding for the inner div
					borderRadius: "8px", // Optional rounded corners for the inner div
					color: "#fff", // Text color to contrast with the dark background
                    minWidth:"50%"
				}}
			>
				<WeatherCard />
			</div>
		</div>
	);
}

export default App;
