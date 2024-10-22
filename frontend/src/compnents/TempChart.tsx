import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

import api from "../util/api-client";
import { useEffect, useState } from "react";

interface WeatherDataBackend {
	id: number;
	city: string;
	time: number;
	main: string;
	temp: number;
	feelsLike: number;
	dt: number;
}

interface TempChartProps {
	city: "Delhi" | "Mumbai" | "Chennai" | "Bangalore" | "Kolkata" | "Hyderabad";
	unit: "Celsius" | "Fahrenheit" | "Kelvin";
}
interface datasets {
	label: string;
	data: number[];
}
interface data {
	labels: string[];
	datasets: datasets[];
}

export default function TempChart(props: TempChartProps) {
	const options = {};
	const [dataData, setData] = useState<data>({ labels: [], datasets: [] });
	useEffect(() => {
		const fetchTemprature = async () => {
			try {
				const weatherDataBackendResponce = await api.get<WeatherDataBackend[]>(
					"/day"
				);
				setData((prv) => {
					const weatherDataBackendFiltered =
						weatherDataBackendResponce.data.filter(
							(weatherDataBackend) => weatherDataBackend.city == props.city
						);
					weatherDataBackendFiltered.sort((a, b) => a.time - b.time);
					// Create a new copy of `prv` and update it
					const updatedData = {
						...prv,
						labels: weatherDataBackendFiltered.map((weatherDataBackend) =>
							new Date(weatherDataBackend.time * 1000).toLocaleString("en-IN", {
								timeZone: "Asia/Kolkata",
								hour: "2-digit",
								minute: "2-digit",
								hour12: false, // 24-hour format
							})
						),
						datasets: [
							{
								...prv.datasets[0],
								label: props.city,
								data: weatherDataBackendFiltered.map((weatherDataBackend) => {
									return props.unit == "Kelvin"
										? weatherDataBackend.temp
										: props.unit == "Celsius"
										? weatherDataBackend.temp - 273.15
										: ((weatherDataBackend.temp - 273.15) * 9) / 5 + 32;
								}),
							},
						],
					};
					return updatedData;
				});
			} catch (error) {
				console.log(error);
			}
		};
		fetchTemprature();
	}, [props.city, props.unit]);
	return <>{<Line options={options} data={dataData} />}</>;
}
