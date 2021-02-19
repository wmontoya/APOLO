//-------- Declaración de variables para complementos --------------------
var express = require('express');
var bodyParser = require('body-parser');
const fs = require('fs');
var MarkdownIt = require('markdown-it'), md = new MarkdownIt();
var nodemailer = require('nodemailer');
const { isMainThread } = require('worker_threads');

//------------------------------------------------------------------------

//------------- Declaración de variables globales ------------------------
var app = express();
var port = process.env.PORT || 3525;
// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var listaArchivosCargados =  [];
var listaArchivosTemporal = [];
//------------------------------------------------------------------------

app.get('/', function(req, res){
    res.status(200).send({
		message: 'GET Home route working fine!'
	});
});


  
app.listen(port, function(){
  

    function enviarCorreos(nombreArchivo){
        fs.readFile('./archivos/'+nombreArchivo, 'utf-8', (error,datos) => {
            if (error)
              console.log(error);
            else
            var result = md.render(datos);
            res.status(200).send(result);
          }); 
    }

    let timerId = setInterval(() => {
       
        fs.readdir('./archivos/', function (err, files) {
           if(listaArchivosCargados.length == 0){
            listaArchivosCargados = files;
           }
            listaArchivosTemporal = files;

        });

        listaArchivosTemporal.sort();
        listaArchivosCargados.sort();

        let encontrado = false;
        var diferentes = [];
        listaArchivosTemporal.forEach(tem =>{
            listaArchivosCargados.forEach(car =>{
                if(tem == car){
                    encontrado = true
                }
            })
            if(encontrado){
                encontrado = false;
            }else{
                encontrado = false;
                diferentes.push(tem);
                listaArchivosCargados.push(tem);
            }
        })

       console.log("diferentes");
        console.log(diferentes);
        

        console.log("temporal");
        console.log(listaArchivosTemporal);
        console.log("cargados");
        console.log(listaArchivosCargados);
    }, 5000);

});   
    
 //Creamos el objeto de transporte
 
//  console.log("Creating transport...");
//     var transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: false,
//         requireTLS: true,
//       auth: {
//         user: 'wmontoya2093@gmail.com',
//         pass: '115290830'
//       }
//     });

//     var mailOptions = {
//       from: 'wmontoya2093@gmail.com',
//       to: 'wmontoya@mpz.go.cr',
//       subject: 'Sending Email using Node.js',
//       text: 'That was easy!'
//     };

//     console.log("sending email", mailOptions);
//     transporter.sendMail(mailOptions, function (error, info) {
//       console.log("senMail returned!");
//       if (error) {
//         console.log("ERROR!!!!!!", error);
//       } else {
//         console.log('Email sent: ' + info.response);
//       }
//     });

//     console.log("End of Script");




 