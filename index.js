var express = require('express');
var bodyParser = require('body-parser');
const fs = require('fs');
var MarkdownIt = require('markdown-it'), md = new MarkdownIt();


var app = express();
var port = process.env.PORT || 3525;

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());




app.get('/', function(req, res){
    // fs.readFile('C:/Users/wmontoya/Documents/GitHub/APOLO/archivos/file.txt', 'utf-8', (error,datos) => {
    //     if (error)
    //       console.log(error);
    //     else
    //     var result = md.render(datos);
    //     res.status(200).send(result);
    //   });
    
});

app.listen(port, function(){
	// console.log(`Server running in http://localhost:${port}`);
	// console.log('Defined routes:');
    // console.log('	[GET] http://localhost:3525/');

    fs.readdir('./archivos/', function (err, files) {
        files.forEach(file => {
            console.log(file);
        });
    });
});