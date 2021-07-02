const functions = require('firebase-functions');
const app = require('express')();
const { db } = require('./connection/database');
const cors = require('cors');
const Auth = require('../functions/auth');

app.use(cors());

/* Importar todos los controladores */
const { 
    getProviders,
    creatProvider,
    getProviderById,
    updatedProvider,
    deleteProvider
} = require('./controllers/providerController');

const {
    getAiroports,
    getAiroportById,
    creatAiroport,
    updatedAiroport,
    deleteAiroport
} = require('./controllers/airportController');

const {
    getProducts,
    getProductById,
    creatProduct,
    updatedProduct,
    deleteProduct,
    productUploadImage
} = require('./controllers/productController');

const {
    getPrivoteProductsAndProviders,
    getPivoteById,
    createPivote,
    updatePricePivote,
    deletePivote
} = require('./controllers/productAndProviderController')

const {
    getContainers,
    getContainersById,
    createContainers,
    updateContainers,
    deleteContainers
} = require('./controllers/containerController');

const {
    userSingup,
    userLoggin,
    userLogout,
    getUsers
} = require('./controllers/userController');
/* Importar todos los controladores */

/* Creacion de rutas por medio de express */
app.post('/registro', userSingup);
app.post('/ingreso', userLoggin);
app.get('/cerrar-sesion', Auth, userLogout);
app.get('/ususarios', Auth, getUsers);

app.get('/proveedores', Auth, getProviders);
app.get('/proveedores/:id', Auth, getProviderById);
app.post('/proveedores', Auth, creatProvider);
app.put('/proveedores/:id', Auth, updatedProvider);
app.delete('/proveedor/:id', Auth, deleteProvider);

app.get('/aeropuertos', Auth, getAiroports);
app.get('/aeropuertos/:id', Auth, getAiroportById);
app.post('/aeropuertos', Auth, creatAiroport);
app.put('/aeropuertos/:id', Auth, updatedAiroport);
app.delete('/aeropuerto/:id', Auth, deleteAiroport);

app.get('/productos', Auth, getProducts);
app.get('/productos/:id', Auth, getProductById);
app.post('/productos', Auth, creatProduct);
app.put('/productos/:id', Auth, updatedProduct);
app.delete('/producto/:id', Auth, deleteProduct);

app.get('/producto/proveedor', Auth, getPrivoteProductsAndProviders);
app.get('/producto/proveedor/:id', Auth, getPivoteById);
app.post('/pivote-crear-producto', Auth, createPivote);
app.put('/proveedor/productos/:id', Auth, updatePricePivote);
app.delete('/delete-privote-product/:id', Auth, deletePivote);

app.get('/contenedores', Auth, getContainers);
app.get('/contenedores/:id', Auth, getContainersById);
app.post('/contenedores', Auth, createContainers);
app.put('/contenedores/:id', Auth, updateContainers);
app.delete('/contenedor/:id', Auth, deleteContainers);

/* Exportamos app para las functions de firebase */
exports.api = functions.region('us-central1').https.onRequest(app);