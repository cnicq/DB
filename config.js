/*
	The configuration file.
*/
var path = require('path');

exports.config = {
	app_port : process.env.PORT || 3000,
	app_title : "指数",
	app_version : "1.0.0",

	db: 'mongodb://127.0.0.1/DBStore',
	export_csv_path : __dirname + '\\csvs\\'
};