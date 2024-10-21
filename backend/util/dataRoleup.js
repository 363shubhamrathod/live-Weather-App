const { syncTime, getCurrentTime } = require("./timeFetchAndSync");
const {
	insertInto5minTable,
	insertIntoDayTable,
} = require("./historyDatabase");

exports.runsEveryminitue = async function runsEveryminitue() {
	await syncTime();
	const time = getCurrentTime();
	const minutes = new Date(time).getMinutes();
	console.log(minutes);
	if (minutes % 5 == 0) {
		await insertInto5minTable();
		
	}
	const formatedTime = time.split("T")[1];
	const timeString = formatedTime.split(":");
    console.log(timeString);
	if (timeString[0] == "23" && timeString[1] == "59"){
        await insertIntoDayTable();
    }
};
