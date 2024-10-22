import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [inProgress, setInProgress] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Basic validation
		if (!email || !password || !confirmPassword) {
			setError("Please fill in all fields.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		// You can handle the signup logic here (e.g., API call)
		setInProgress(true);
		async function callingBackend() {
			const respo = await fetch("http://localhost:3000/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			if (respo.ok) {
				navigate("/login");
			}
            else{
                setError("request failed")
            }
		}
		callingBackend();

		// Clear the error if validation passes
		setError("");

		// Reset the form
		setEmail("");
		setPassword("");
		setConfirmPassword("");
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
			<h2>Signup</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
					/>
				</div>
				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
					/>
				</div>
				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="confirmPassword">Confirm Password:</label>
					<input
						type="password"
						id="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
					/>
				</div>
				<button
					type="submit"
					style={{ padding: "0.5rem 1rem" }}
					disabled={inProgress}
				>
					Signup
				</button>
			</form>
			<Link to={"/login"}>have account login</Link>
		</div>
	);
};

export default Signup;
