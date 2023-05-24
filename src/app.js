
import express from "express";
import prodRouter from "./routes/products.js";
import cartRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.router.js";

import __dirname from "./utils.js";
import uploadRouter from "./routes/uploadfiles.router.js"

import handlebars from "express-handlebars";
import { Server } from 'socket.io';

const app = express();

//configuracion puerto
const PUERTO = process.env.port || 8080;
const httpServer = app.listen(PUERTO, () => {console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);});


//creare servidor para trabajar con socket
const io = new Server(httpServer) 
//para interpretar mejor los datos de las query
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//carpeta PUBLIC con route absoluta __dirname
app.use(express.static(`${__dirname}/public`));  //cambiar ruta agregar /upload/public

//use handlebars views
app.engine('handlebars', handlebars.engine());//motor de busqueda
app.set('views', `${__dirname}/views`); //ruta de busqueda
app.set('view engine','handlebars'); //resultado de la busqueda
app.use('/', viewsRouter);
 
//use handlebars products
app.set('products', `${__dirname}/api`); //ruta de busqueda
app.set('product engine','handlebars'); //resultado de la busqueda
app.use('/api/products/', prodRouter);

//ruta normales
app.use('/api/carts/', cartRouter);
app.use('/api/upload/', uploadRouter);


// Ruta GET para mostrar el listado de productos en tiempo real
app.get("/realtimeproducts", async (req, res) => {
  const filterLimit = await productList.products();
  if (req.query.limit) {
    const productsRealTime = filterLimit.slice(0, req.query.limit);
    res.render('realtimeproducts', { productsRealTime });
  } else {
    const productsRealTime = filterLimit.slice(0, req.query.limit);
    res.render('realtimeproducts', { productsRealTime });
  };
});

// websocket
io.on('connection', (socketClient) => {
  console.log(`Cliente conectado por socket: ${socketClient.id}`)
  socketClient.on('message', data => {
    console.log(data)
  });
  //ms solo para mi usuario
  socketClient.emit('evento_para_mi_usuario', 'Actualización de datos')
  //ms para todos menos para mi usuario
  socketClient.broadcast.emit('evento_para_todos_menos_el_actual', 'Actualización de datos')
  //ms para todos los usuarios
  io.emit('evento_para_todos', 'Actualización de datos global')
});


export {app, io};
