const express = require("express");
require("dotenv").config;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const checksBeforeServerStart = require("./util/checksBeforeServerStart");
const { getCurrentTime } = require("./util/timeFetchAndSync");
const { getCurrentTemperature } = require("./util/weaterFetchAndSync");
const { getDaysWeatherData } = require("./util/historyDatabase");
const { User, Alert } = require("./util/database");

checksBeforeServerStart()
	.then(() => {
		const app = express();
		app.use(cors());
		app.use(express.json());
		console.log(getCurrentTemperature());
		console.log(getCurrentTime());
		app.use("/login", async (req, res, next) => {
			const data = req.body;
			try {
				const user = await User.findOne({ where: { email: data.email } });
				const isMatch = bcrypt.compareSync(data.password, user.password);
				if (!isMatch) {
					return next(new Error("user dosent exist"));
				}

				const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET);
				return res.status(200).json({ token });
			} catch {
				return next(new Error("Something went wrong"));
			}
			return res.sendStatus(401);
		});
		app.use("/signup", async (req, res, next) => {
			const data = req.body;
			// console.log(data);
			try {
				data.password = bcrypt.hashSync(data.password, 10);
				await User.create(data);
			} catch {
				throw new Error("Something went wrong");
			}
			return res.sendStatus(201);
		});
		app.get("/alert", async (req, res, next) => {
			const token = req.get("Authorization");
			if (!token) {
				err = new Error("Token Not attached");
				err.status = 404;
				return next(err);
			}
			try {
				const authToken = token.split(" ")[1];
				// console.log(authToken);
				const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
				if (!decoded) {
					err = new Error("Token not valid");
					err.status = 404;
					return next(err);
				}
				const user = await User.findByPk(decoded.id);
				const data =await user.getAlerts();
                res.status(200).json(data);
			} catch {
				err = new Error("Invalid request");
				err.status = 404;
				next(err);
			}
		});
        app.post("/alert", async (req, res, next) => {
			const token = req.get("Authorization");
			if (!token) {
				err = new Error("Token Not attached");
				err.status = 404;
				return next(err);
			}
			try {
				const authToken = token.split(" ")[1];
				const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
				if (!decoded) {
					err = new Error("Token not valid");
					err.status = 404;
					return next(err);
				}
				const user = await User.findByPk(decoded.id);
                if (!user) {
					err = new Error("User Not Found");
					err.status = 404;
					return next(err);
				}
                const data = {
                    city:req.body.city,
                    alertTemp:req.body.alertTemp,
                    message:req.body.message,
                    greater:req.body.greater,
                }
				await user.createAlert(data);
                res.sendStatus(201);
			} catch {
				err = new Error("Invalid request");
				err.status = 404;
				next(err);
			}
		});
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
