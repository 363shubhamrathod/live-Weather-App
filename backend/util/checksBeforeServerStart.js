const { syncTime } = require("./timeFetchAndSync");
const { syncWeather } = require("./weaterFetchAndSync");
const { runsEveryminitue } = require("./dataRoleup");

module.exports = async () => {
	try {
		await syncTime();
		await syncWeather();
	} catch (err) {
		throw err;
	}
	setInterval(runsEveryminitue, 60000);
};

