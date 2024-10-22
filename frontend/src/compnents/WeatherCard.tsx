import { useEffect, useState } from "react";

import api from "../util/api-client";
import TempChart from "./TempChart";
import { useLocation } from "react-router-dom";
import Alert from "./Alert";

interface CityWeather {
	main: string | undefined;
	temp: number | undefined;
	feelsLike: number | undefined;
	dt: number | undefined;
}

interface WeatherData {
	Delhi: CityWeather;
	Mumbai: CityWeather;
	Chennai: CityWeather;
	Bangalore: CityWeather;
	Kolkata: CityWeather;
	Hyderabad: CityWeather;
}

type unitForTemp = "Celsius" | "Fahrenheit" | "Kelvin";

export default function WeatherCard() {
	const [tempUnit, setTempUnit] = useState<unitForTemp>("Kelvin");
	const [city, setCity] = useState<keyof WeatherData>("Delhi");
	const [tempData, setTempData] = useState<WeatherData>({
		Delhi: {
			main: undefined,
			temp: undefined,
			feelsLike: undefined,
			dt: undefined,
		},
		Mumbai: {
			main: undefined,
			temp: undefined,
			feelsLike: undefined,
			dt: undefined,
		},
		Chennai: {
			main: undefined,
			temp: undefined,
			feelsLike: undefined,
			dt: undefined,
		},
		Bangalore: {
			main: undefined,
			temp: undefined,
			feelsLike: undefined,
			dt: undefined,
		},
		Kolkata: {
			main: undefined,
			temp: undefined,
			feelsLike: undefined,
			dt: undefined,
		},
		Hyderabad: {
			main: undefined,
			temp: undefined,
			feelsLike: undefined,
			dt: undefined,
		},
	});
	useEffect(() => {
		const fetchTemprature = async () => {
			try {
				const tempResponce = await api.get<WeatherData>("/");
				setTempData(tempResponce.data);
				console.log("data has been fetched");
			} catch (error) {}
		};
		fetchTemprature();
		const interval = setInterval(fetchTemprature, 6000);
		return () => {
			clearInterval(interval);
		};
	}, []);
	const tempUnits = ["Kelvin", "Celsius", "Fahrenheit"];
	const cities = [
		"Delhi",
		"Mumbai",
		"Chennai",
		"Bangalore",
		"Kolkata",
		"Hyderabad",
	];
	const toCelsius = (tempInKelvin: number): number => {
		return tempInKelvin - 273.15; // Convert Kelvin to Celsius
	};

	const toFahrenheit = (tempInKelvin: number): number => {
		return (tempInKelvin - 273.15) * (9 / 5) + 32; // Convert Kelvin to Fahrenheit
	};
	const location = useLocation();
	return (
		<>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
				}}
			>
				<h1>Weather data</h1>
				<div>
					<label htmlFor="tempUnit">Select Temperature Unit:</label>
					<select
						id="tempUnit"
						value={tempUnit}
						onChange={(e) => setTempUnit(e.target.value as unitForTemp)}
						style={{
							backgroundColor: "rgba(0, 0, 0, 0.1)",
							padding: ".25rem",
							borderRadius: ".5rem",
						}}
					>
						{tempUnits.map((unit) => (
							<option key={unit} value={unit}>
								{unit}
							</option>
						))}
					</select>

					<label htmlFor="city">Select City:</label>
					<select
						id="city"
						value={city}
						onChange={(e) => setCity(e.target.value as keyof WeatherData)}
						style={{
							backgroundColor: "rgba(0, 0, 0, 0.1)",
							padding: ".25rem",
							borderRadius: ".5rem",
						}}
					>
						{cities.map((city) => (
							<option key={city} value={city}>
								{city}
							</option>
						))}
					</select>
				</div>
				<div>
					<h3>Temprature</h3>
					<h4>
						{tempUnit === "Kelvin" && `${tempData[city].temp} K`}{" "}
						{tempUnit === "Celsius" &&
							tempData[city].temp &&
							`${toCelsius(tempData[city].temp).toFixed(2)} °C`}{" "}
						{tempUnit === "Fahrenheit" &&
							tempData[city].temp &&
							`${toFahrenheit(tempData[city].temp).toFixed(2)} °F`}{" "}
					</h4>
				</div>
				<div>
					<h3>Feels Like</h3>
					<h4>
						{tempUnit === "Kelvin" && `${tempData[city].feelsLike} K`}{" "}
						{tempUnit === "Celsius" &&
							tempData[city].feelsLike &&
							`${toCelsius(tempData[city].feelsLike).toFixed(2)} °C`}{" "}
						{tempUnit === "Fahrenheit" &&
							tempData[city].feelsLike &&
							`${toFahrenheit(tempData[city].feelsLike).toFixed(2)} °F`}{" "}
					</h4>
				</div>
				<div>
					<h3>Main</h3>
					<h4>{tempData[city].main}</h4>
				</div>
				<div>
					<h3>Dt</h3>
					<h4>
						{tempData[city].dt &&
							new Date(tempData[city].dt * 1000).toLocaleString("en-IN", {
								timeZone: "Asia/Kolkata",
							})}
					</h4>
				</div>
			</div>
			<div>
				<TempChart city={city} unit={tempUnit} />
			</div>
			{location.pathname == "/authentcated" && (
				<div style={{ margin: "1rem" }}>
					<div
						style={{ background: "rgba(175, 175,0, 0.4)", minWidth: "100%" }}
					>
						<Alert />
					</div>
				</div>
			)}
		</>
	);
}
