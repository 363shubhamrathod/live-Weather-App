const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./database.sqlite",
});

async function testDatabaseConnection() {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
}

sequelize.define("time5min", {});

sequelize.define("timeDaily", {});

testDatabaseConnection()
	.then(() => {
		console.log("connection succesfull");
		return sequelize.sync();
		// return sequelize.sync();
		// return sequelize.sync();
	})
	.then(() => {
		console.log("database is in sync");
	})
	.catch((err) => {
		throw new Error("database down");
	});
