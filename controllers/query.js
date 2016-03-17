var fs = require('fs');
var http = require('http');
var async = require('async');
var upload_folder = '/../uploads';

function Query(raw_query) {
	this.raw_query = raw_query;
	this.annotated_query = raw_query;
	this.parsed_query = null;
	this.validate_query = function () {
	    var stack = [];
	    for (var i = 0; i < query.length; i++) {
	        if (query[i] == '{' || query[i] == '[') {
	            stack.push([query[i],i])
	        } else if(query[i] == '}') {
	            if (stack.length == 0) {
	                return false;
	            } else {
	                if (stack.pop()[0] != '{') {
	                    console.log(stack)
	                    return false;
	                }
	            }
	        } else if(query[i] == ']') {
	            if (stack.length == 0) {
	                return false;
	            } else {
	                if (stack.pop()[0] != '[') {
	                    return false;
	                }
	            }
	        }
	    }
	    return true;
	};
}

function parse_file(filename, parser_url) {

}

function parse_multiple(queries, parser_url, call_back) {
	var query_objs = []
	for (var i = 0; i < queries.length; i++) {
		var query = new Query(queries[i]);
		query_objs.push(query);
	}
	hosts = split_host_and_path(parser_url);
	async.eachSeries(query_objs, function (query, callback) {
		var post_data = JSON.stringify({
			query: query.raw_query
		});
		var post_req = http.request({
			host:hosts[0],
			path:hosts[1],
			method: 'POST',
			port:80,
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': post_data.length
			}
		}, function(res) {
			res.setEncoding('utf8');
			var data = "";
			res.on('data', function (chunk) {
			    data += chunk;
			});
			res.on('end', function () {
				json_data = JSON.parse(data);
				// console.log(json_data["parsed-query"]["parsed-query"]);
				query.parsed_query = json_data["parsed-query"]["parsed-query"];
				// console.log(query.parsed_query);
				callback(null);
			});
		});
		post_req.write(post_data);
  		post_req.end();
	},
	function () {
		call_back(query_objs);
	});
}

function split_host_and_path(parser_url) {
	// get rid of http:// https:// if there is
	var index = parser_url.indexOf("//");
	if (index != -1) {
		parser_url = parser_url.substring(index+2);
	}
	index = parser_url.indexOf("/");
	var results = [];
	results.push(parser_url.substring(0, index));
	results.push(parser_url.substring(index));
	return results;
}


module.exports.parse_multiple = parse_multiple;
// queries = ['show me some laptops under $150', 'show me popular laptops'];
// parser_url = 'http://dev-demo-000.dev/product-discovery/parse';
// parse_multiple(queries, parser_url);
// console.log(split_host_and_path('http://dev-demo-000.dev/product-discovery/parse'));