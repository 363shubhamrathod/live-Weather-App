import { useEffect, useState } from "react";
import api from "../util/api-client";
import AlertCard from "./AlertCard";

interface CityWeather {
	main: string;
	temp: number;
	feelsLike: number;
	dt: number;
}

// Define a union type for the city names
type CityName = "Delhi" | "Mumbai" | "Chennai" | "Bangalore" | "Kolkata" | "Hyderabad";

interface WeatherData {
	Delhi: CityWeather;
	Mumbai: CityWeather;
	Chennai: CityWeather;
	Bangalore: CityWeather;
	Kolkata: CityWeather;
	Hyderabad: CityWeather;
}

interface AlertDataBackend {
	UserId: number;
	alertTemp: number;
	city: CityName; // Use the defined union type here
	createdAt: string;
	greater: boolean;
	id: number;
	message: string;
	updatedAt: string;
}

export default function Alert() {
	const [alerts, setAlerts] = useState<AlertDataBackend[]>([]);
	const storageToken = window.localStorage.getItem("Token");

	useEffect(() => {
		const fetchDataFromBackend = async () => {
			try {
				// Fetching alerts
				const alertsResponse = await fetch("http://localhost:3000/alert", {
					headers: {
						Authorization: `Bearer ${storageToken}`,
					},
				});
				const alertsDataBackend: AlertDataBackend[] = await alertsResponse.json();

				// Fetching weather data
				const weatherDataResponse = await api.get<WeatherData>("/");
				const weatherData = weatherDataResponse.data;

				// Filtering alerts based on the temperature conditions
				const filteredAlerts = alertsDataBackend.filter((alert) => {
					const cityWeather = weatherData[alert.city]; // TypeScript now knows `alert.city` is a valid key
					if (cityWeather) {
						return alert.greater
							? cityWeather.temp > alert.alertTemp
							: cityWeather.temp < alert.alertTemp;
					}
					return false;
				});

				// Updating state with filtered alerts
				setAlerts(filteredAlerts);
			} catch (error) {
				console.error("Error fetching data", error);
			}
		};

		fetchDataFromBackend();
	}, [storageToken]);

	return (
		<div>
			{alerts.length > 0 ? (
				alerts.map((alert) => <AlertCard data={alert} key={alert.id} />)
			) : (
				<p>No alerts found.</p>
			)}
		</div>
	);
}
