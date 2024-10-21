require("dotenv").config();

let currentTemperature = {
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
};

exports.getCurrentTemperature = () => currentTemperature;

exports.syncWeather = async function syncWeather() {
	try {
		// checking if Weather API is working
		const url = new URL("https://api.openweathermap.org/data/2.5/weather");
		const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
		if (!OPENWEATHERMAP_API_KEY) {
			throw new Error("API key not define");
		}
		url.searchParams.append("appid", OPENWEATHERMAP_API_KEY);
		const fetchPromises = Object.keys(currentTemperature).map(async (key) => {
			url.searchParams.set("q", key);
			const data = await fetch(url.href);
			if (!data.ok) {
				throw new Error("Weather API Server Down");
			}
			const weaterDataOfCity = await data.json();
			currentTemperature[key]["main"] = weaterDataOfCity.weather[0].main;
			currentTemperature[key]["temp"] = weaterDataOfCity.main.temp;
			currentTemperature[key]["feelsLike"] = weaterDataOfCity.main.feels_like;
			currentTemperature[key]["dt"] = weaterDataOfCity.dt;
		});
		await Promise.all(fetchPromises);
	} catch (error) {
		console.log(error);
	}
};
