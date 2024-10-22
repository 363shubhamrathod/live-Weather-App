const { Sequelize, DataTypes } = require("sequelize");

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

const User = sequelize.define("User", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	email: {
		type: DataTypes.TEXT,
		allowNull: false,
		unique: true,
	},
	password: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
});

const Alert = sequelize.define("Alert", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	city: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	alertTemp: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	message: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
    greater:{
        type: DataTypes.BOOLEAN,
		allowNull: false,
    }
});

User.hasMany(Alert);
Alert.belongsTo(User);

testDatabaseConnection()
	.then(() => {
		console.log("connection succesfull");
		// return sequelize.sync({ force: true });
		// return sequelize.sync({alter: true });
		return sequelize.sync();
	})
	.then(() => {
		console.log("database is in sync");
	})
	.catch((err) => {
		throw new Error("database down");
	});

exports.Alert = Alert;
exports.User = User;
