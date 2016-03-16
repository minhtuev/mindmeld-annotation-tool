var express = require('express')
var multer = require('multer')
var app = express()
var upload = multer({ dest: 'uploads/' })

app.use(express.static(__dirname + '/media'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    var util = require('./libs/util');
    parsers = util.load_parsers();
    res.render('index', {parsers: parsers});
});

app.post('/upload', upload.array('files'), function (req, res) {
    console.log(req.files);
    res.send(JSON.stringify({status: "success"}));
    console.log(req);
});

app.listen(3000, function () {
    console.log('Starting Server ...');
});