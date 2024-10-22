import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AlertForm: React.FC = () => {
	const [city, setCity] = useState<string>("Delhi");
	const [temperature, setTemperature] = useState<string>("");
	const [condition, setCondition] = useState<string>("greater");
	const [error, setError] = useState<string>("");
	const [message, setMessage] = useState<string>("");

	const [inProgress, setInProgress] = useState<boolean>(false);
	const navigate = useNavigate();
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Basic validation
		if (!temperature) {
			setError("Please enter a temperature value.");
			return;
		}

		// You can handle the form logic here (e.g., API call)
		setInProgress(true);
		async function callingBackend() {
            const storageToken=window.localStorage.getItem("Token")
			const respo = await fetch("http://localhost:3000/alert", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
                    Authorization: `Bearer ${storageToken}`
				},
				body: JSON.stringify({
					city,
					alertTemp: temperature,
					message,
					greater: condition == "greater",
				}),
			});
			if (respo.ok) {
				navigate("/authentcated");
			} else {
				setError("request failed");
			}
		}
		try {
			callingBackend();
		} catch (error) {
			setError("someting went wrong");
		}

		// Clear the error if validation passes
		setError("");

		// Reset the form
		setCity("Delhi");
		setTemperature("");
		setCondition("greater");
	};

	return (
		<div
			style={{
				maxWidth: "400px",
				margin: "0 auto",
				padding: "20px",
				border: "1px solid #ccc",
				borderRadius: "8px",
			}}
		>
			<h2>Create Alert</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<form onSubmit={handleSubmit}>
				{/* City Dropdown */}
				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="city">City:</label>
					<select
						id="city"
						value={city}
						onChange={(e) => setCity(e.target.value)}
						style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
					>
						<option value="Delhi">Delhi</option>
						<option value="Mumbai">Mumbai</option>
						<option value="Chennai">Chennai</option>
						<option value="Bangalore">Bangalore</option>
						<option value="Kolkata">Kolkata</option>
						<option value="Hyderabad">Hyderabad</option>
					</select>
				</div>

				{/* Temperature Input */}
				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="temperature">Alert Temperature (Kelvin):</label>
					<input
						type="number"
						id="temperature"
						value={temperature}
						onChange={(e) => setTemperature(e.target.value)}
						required
						style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
					/>
				</div>

				{/* Condition Radio Buttons */}
				<div style={{ marginBottom: "1rem" }}>
					<label>Condition:</label>
					<div style={{ marginTop: "0.5rem" }}>
						<label>
							<input
								type="radio"
								name="condition"
								value="greater"
								checked={condition === "greater"}
								onChange={(e) => setCondition(e.target.value)}
							/>
							Greater than
						</label>
						<label style={{ marginLeft: "1rem" }}>
							<input
								type="radio"
								name="condition"
								value="less"
								checked={condition === "less"}
								onChange={(e) => setCondition(e.target.value)}
							/>
							Less than
						</label>
					</div>
				</div>
				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="message">Message:</label>
					<input
						type="text"
						id="message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						required
						style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
					/>
				</div>
				{/* Submit Button */}
				<button
					type="submit"
					style={{ padding: "0.5rem 1rem" }}
					disabled={inProgress}
				>
					Create Alert
				</button>
			</form>
		</div>
	);
};

export default AlertForm;
