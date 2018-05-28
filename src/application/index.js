
const application = ({ server, database }) => ({
	run: () =>
		database.connect()
			.then(() => server.start())
			.catch((error) => { throw error; })
});

module.exports = application;
