const express = require("express");
require("dotenv").config;
const cors = require("cors");

const checksBeforeServerStart = require("./util/checksBeforeServerStart");
const { getCurrentTime } = require("./util/timeFetchAndSync");
const { getCurrentTemperature } = require("./util/weaterFetchAndSync");
const { getDaysWeatherData } = require("./util/historyDatabase");

checksBeforeServerStart()
	.then(() => {
		const app = express();
		app.use(cors());
		app.use(express.json());
		console.log(getCurrentTemperature());
		console.log(getCurrentTime());
		app.use("/day", async (req, res, next) => {
			const data = await getDaysWeatherData();
			res.status(200).json(data);
		});
		app.use("/", (req, res, next) => {
			res.status(200).json(getCurrentTemperature());
		});
		app.use((err, req, res, next) => {
			res.status(500).json({ message: "resourse not found" });
		});
		const PORT = process.env.PORT || 3000;
		app.listen(PORT);
	})
	.catch((err) => {
		console.log(err);
	});
