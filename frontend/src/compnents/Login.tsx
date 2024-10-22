import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [inProgress, setInProgress] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Basic validation
		if (!email || !password) {
			setError("Please fill in both fields.");
			return;
		}

		// You can handle the login logic here (e.g., API call)
		setInProgress(true);
		async function callingBackend() {
            
			const respo = await fetch("http://localhost:3000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
                    
				},
				body: JSON.stringify({ email, password }),
			});
			const resp = await respo.json();
			if (respo.ok) {
				console.log(resp.token);
				window.localStorage.setItem("Token", resp.token);
				navigate("/authentcated");
			} else {
				setError("request failed");
			}
		}
		try {
			callingBackend();
		} catch (error) {
            setError("someting went wrong")
        }

		// Clear the error if validation passes
		setError("");

		// Reset the form
		setEmail("");
		setPassword("");
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
			<h2>Login</h2>
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
				<button
					type="submit"
					style={{ padding: "0.5rem 1rem" }}
					disabled={inProgress}
				>
					Login
				</button>
			</form>
			<Link to={"/signup"}>dont have account signup</Link>
		</div>
	);
};

export default Login;
