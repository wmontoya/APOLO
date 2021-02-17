var express = require('express');
var bodyParser = require('body-parser');
const fs = require('fs');
var toMarkdown = require('to-markdown');


var app = express();
var port = process.env.PORT || 3525;

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
	res.status(200).send({
		message: toMarkdown('<h1>Hello world!</h1>', { gfm: true })
	});
});

app.listen(port, function(){
	// console.log(`Server running in http://localhost:${port}`);
	// console.log('Defined routes:');
    // console.log('	[GET] http://localhost:3525/');
    
   
      fs.readFile('C:/Users/wmontoya/Documents/GitHub/APOLO/archivos/file.txt', 'utf-8', (error,datos) => {
        if (error)
          console.log(error);
        else
          console.log(datos.toString());
      });
});