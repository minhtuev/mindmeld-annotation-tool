var express = require('express')
var multer = require('multer')
var bodyParser = require('body-parser')

var app = express()
var upload = multer({ dest: 'uploads/' })
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static(__dirname + '/media'));
app.set('view engine', 'ejs');

var util = require('./libs/util');
parsers = util.load_parsers();
parser_url_mapping = {}
for (var i = 0; i < parsers.length; i++) {
    parser_url_mapping[parsers[i].parser_name] = parsers[i].parse_url;
}
app.get('/', function (req, res) {
    res.render('index', {parsers: parsers});
});

app.post('/upload', upload.array('files'), function (req, res) {
    res.send(JSON.stringify({status: "success"}));
});

app.post('/parse', function (req, res) {
    var query = require('./controllers/query')
    var queries = req.body.queries;
    var parser = req.body.parser.toLowerCase();
    var parser_url = parser_url_mapping[parser];
    query.parse_multiple(queries, parser_url, function(parsed_queries) {
        response_body = {
            status: "success",
            queries: JSON.stringify(parsed_queries)
        }
        // console.log(response_body);
        res.send(JSON.stringify(response_body));
    });
});

app.listen(3000, function () {
    console.log('Starting Server ...');
});