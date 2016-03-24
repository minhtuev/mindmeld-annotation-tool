var fs = require('fs');
var config_file_path = __dirname + '/../config.json'

function load_parsers() {
	var file = fs.readFileSync(config_file_path);
	var data = JSON.parse(file);
	return data.parsers;
}

module.exports.load_parsers = load_parsers;