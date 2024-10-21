let currentTime = undefined;

exports.getCurrentTime = () => currentTime;
exports.syncTime = async function syncTime() {
	try {
		// checking if Time API is working
		// const data = await fetch("https://timeapi.io/api/health/check");
		// if (!data.ok) {
		// 	throw new Error("Time Server Down");
		// }

		// getting current time
		const timeBuffer = await fetch(
			"https://timeapi.io/api/timezone/zone?timeZone=Asia%2FKolkata"
		);
		const time = await timeBuffer.json();

		currentTime = time["currentLocalTime"];
	} catch (err) {
		console.log(err);
	}
};
