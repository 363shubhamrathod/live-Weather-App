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
	ChartOptions,
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
const data = {
	labels: ["Monday", "tuesday"],
	datasets: [
		{
			label: "Steps",
			data: [500, 600],
		},
	],
};
export default function TempChart(props: TempChartProps) {
	const options: ChartOptions<"line"> = {
		scales: {
			x: {
				type: "time",
				time: {
					unit: "minute",
					tooltipFormat: "ll HH:mm",
					displayFormats: {
						minute: "HH:mm",
					},
				},
				title: {
					display: true,
					text: "Time (IST)",
				},
			},
			y: {
				title: {
					display: true,
					text: "Temperature (°C)",
				},
			},
		},
	};
	const [dataData, setData] = useState(data);
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
								data: weatherDataBackendFiltered.map(
									(weatherDataBackend) => weatherDataBackend.temp
								),
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
