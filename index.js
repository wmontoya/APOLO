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
// -----------------------------------------------------------

var listaArchivosCargados =  [];
var listaArchivosTemporal = [];
var listaArchivosDiferentes = [];

var correosClientes = ['wmontoya@mpz.go.cr','sanwili@hotmail.com']; // se pueden agregar más correos

// Definición del encabezado de Correo, son los datos del servidor de correo
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
  auth: {
    user: 'wmontoya2093@gmail.com',
    pass: '115290830'
  }
});

//------------------------------------------------------------------------

//------ Funciones y procedimientos --------------------------------------

app.get('/', function(req, res){
    res.status(200).send({
		message: 'El servicio web esta funcionando'
	});
});

function enviarCorreos(nombreArchivo){ 
    let falloEnvio = false;
    console.log('Nuevo archivo encontrado -> '+nombreArchivo+' -> Enviando Email...');
    fs.readFile('./archivos/'+nombreArchivo+'', 'utf-8', (error,datos) => { // creamos y definimos la raiz donde se encuentran almacenados los archivos.
        if (error){
            console.log('Fallo al cargar archivo -> '+error);
        }else{
            var mailOptions = {
                from: correosClientes, // array con la lista de correos a los que se enviara el correo.
                to: 'wmontoya@mpz.go.cr',
                subject: 'Notas de interes comercial',
                html: md.render(datos)
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    falloEnvio = true;
                    console.log("Fallo: ", error);
                } else {
                   falloEnvio = false;
                }
            });
        }
    }); 
    if(!falloEnvio){
        console.log('Correos enviados correctamente...');
    }
}

app.listen(port, function(){
  
    let timerId = setInterval(() => {
       console.log('Revisando archivos...');
        fs.readdir('./archivos/', function (err, files) {
            listaArchivosDiferentes = [];
            if(listaArchivosCargados.length == 0){
            listaArchivosCargados = files;
            listaArchivosDiferentes = files;
           }
            listaArchivosTemporal = files;
        });

        listaArchivosTemporal.sort(); // Ordenar listas
        listaArchivosCargados.sort();

        let encontrado = false; // Bandera para revisar las listas
        
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
                listaArchivosDiferentes.push(tem);
                listaArchivosCargados.push(tem);
            }
        })

        if(listaArchivosDiferentes != []){
            listaArchivosDiferentes.forEach(result => {
                enviarCorreos(result);
            })
        }
    }, 15000);

});   
    
//------------------------------------------------------------------------






 