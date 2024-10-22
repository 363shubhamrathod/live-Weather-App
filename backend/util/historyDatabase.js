const Database = require("better-sqlite3");

const { syncWeather, getCurrentTemperature } = require("./weaterFetchAndSync");
const { getCurrentTime } = require("./timeFetchAndSync");

const db = new Database("history.db", {
	verbose: console.log,
});

const createTable5min = db.prepare(
	"CREATE TABLE IF NOT EXISTS weather5 (id INTEGER PRIMARY KEY AUTOINCREMENT,city VARCHAR(50) NOT NULL,time date NOT NULL,main VARCHAR(50) NOT NULL,temp INTEGER NOT NULL,feelsLike INTEGER NOT NULL,dt date NOT NULL)"
);
createTable5min.run();

const createTableDay = db.prepare(
	"CREATE TABLE IF NOT EXISTS weatherDay (id INTEGER PRIMARY KEY AUTOINCREMENT,city VARCHAR(50) NOT NULL,time date NOT NULL,main VARCHAR(50) NOT NULL,tempAvg INTEGER NOT NULL,tempMin INTEGER NOT NULL,tempMax INTEGER NOT NULL)"
);
createTableDay.run();

const newTableData5min = db.prepare(
	"INSERT INTO weather5 (city,time,main,temp,feelsLike,dt) VALUES (?,?,?,?,?,?) "
);

const newTableDataDay = db.prepare(
	"INSERT INTO weatherDay (city,time,main,tempAvg,tempMin,tempMax) VALUES (?,?,?,?,?,?) "
);

const agrigateForRoleup = db.prepare(`
WITH WeatherCount AS (
    SELECT 
        city, 
        main, 
        COUNT(main) AS main_count
    FROM 
        weather5
    WHERE 
        DATE(datetime(dt, 'unixepoch', '+5 hours', '+30 minutes')) = ?  
    GROUP BY 
        city, main
)
SELECT 
    w.city,
    MIN(w.temp) AS min_temp,
    MAX(w.temp) AS max_temp,
    AVG(w.temp) AS avg_temp,
    wc.main AS most_frequent_main
FROM 
    weather5 w
JOIN 
    WeatherCount wc ON w.city = wc.city
WHERE 
    DATE(datetime(w.dt, 'unixepoch', '+5 hours', '+30 minutes')) = ?  
    AND wc.main_count = (
        SELECT MAX(main_count) 
        FROM WeatherCount 
        WHERE city = w.city
    )
GROUP BY 
    w.city, wc.main
`);

const daysData = db.prepare(`
        SELECT *
        FROM weather5
        WHERE time >= strftime('%s', 'now', '-24 hours')
    `);
exports.insertInto5minTable = async function insertInto5minTable() {
	await syncWeather();
	const currentTemperature = getCurrentTemperature();
	const currentTime = getCurrentTime();
	Object.keys(currentTemperature).map((key) => {
		newTableData5min.run(
			key,
			Math.floor(new Date(currentTime).getTime() / 1000),
			currentTemperature[key]["main"],
			currentTemperature[key]["temp"],
			currentTemperature[key]["feelsLike"],
			currentTemperature[key]["dt"]
		);
	});
};

exports.insertIntoDayTable = async function insertIntoDayTable() {
	const currentTime = getCurrentTime();
	const formattedDate = currentTime.split("T")[0];
	// console.log(formattedDate);
	const data = agrigateForRoleup.all(formattedDate, formattedDate);
	// console.log(data);
	data.forEach((record) => {
		newTableDataDay.run(
			record.city,
			Math.floor(new Date(currentTime).getTime() / 1000),
			record.most_frequent_main,
			record.avg_temp,
			record.min_temp,
			record.max_temp
		);
	});
};

exports.getDaysWeatherData = async () => {
	return daysData.all();
};


exports.getDB = () => db;
