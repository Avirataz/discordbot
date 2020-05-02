module.exports.getMessage = (userID, database) => {
	return database.get(`SELECT message, datetime_text FROM afk WHERE id == "${userID}"`);
};

module.exports.insertOrReplace = (userID, database, message) => {
	return database.run(`INSERT OR REPLACE INTO afk (id, message, datetime_text) VALUES("${userID}", "${message}", "${new Date().toISOString()}")`)
};

module.exports.remove = (userID, database) => {
	return database.run(`DELETE FROM afk WHERE id == "${userID}"`);
};

module.exports.getAllIDs = (database) => {
	return database.all(`SELECT id FROM afk`);
};
