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

var listaArchivosCargados =  []; // almacena en memoria los rachivos que ya sen enviaron por correo
var listaArchivosTemporal = []; // almacena los archivos de la carpeta en cada lectura
var listaArchivosDiferentes = []; // almacena los archivos que aparecen durante la utilización de la aplicación

var correosClientes = ['correo1@hotmail.com','correo2@gmail.com']; // se pueden agregar más correos

// Definición del encabezado de Correo, son los datos del servidor de correo
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
  auth: {
    user: 'correo@gmail.com',
    pass: 'contraseña'
  }
});

//------------------------------------------------------------------------

//------ Funciones y procedimientos --------------------------------------

app.get('/', function(req, res){
    res.status(200).send({
		message: 'El servicio web esta funcionando' //mensaje correcto en el navegador
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
                to: 'envia@gmail.com',
                subject: 'Notas de interes comercial',
                html: md.render(datos) // se renderisa los archivos y su contenido.
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
            listaArchivosDiferentes = [];       // limpiamos 
            if(listaArchivosCargados.length == 0){ // si es el primer uso
            listaArchivosCargados = files;
            listaArchivosDiferentes = files;
           }
            listaArchivosTemporal = files;
        });

        listaArchivosTemporal.sort(); // Ordenar listas
        listaArchivosCargados.sort();

        let encontrado = false; // Bandera para revisar las listas
        
        listaArchivosTemporal.forEach(tem =>{
            listaArchivosCargados.forEach(car =>{ // comparamos las listas para determinar que archivo es nuevo con respecto a los guardados en memoria
                if(tem == car){
                    encontrado = true
                }
            })
            if(encontrado){
                encontrado = false;
            }else{
                encontrado = false;
                listaArchivosDiferentes.push(tem); // agregamos datos a las listas
                listaArchivosCargados.push(tem);
            }
        })

        if(listaArchivosDiferentes != []){
            listaArchivosDiferentes.forEach(result => { // se determina los archivos nuevos que seran enviados por correo
                enviarCorreos(result);
            })
        }
    }, 15000);

});   
    
//------------------------------------------------------------------------

 