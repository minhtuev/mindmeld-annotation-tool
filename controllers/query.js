var fs = require('fs');
var upload_folder = '/../uploads';

function Query(raw_query) {
	this.raw_query = raw_query;
	this.parsed_query = null;
}

function parse(filename, parser_url) {
	
}