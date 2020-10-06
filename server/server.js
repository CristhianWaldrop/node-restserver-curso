require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const MONGODB_URI = 'mongodb+srv://user:zfIncPpj2STUAwgn@cluster0.0i6hv.mongodb.net/cafeudemy?retryWrites=true&w=majority';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// IMPORTO EL ARCHIVO CENTRAL CON LAS RUTAS
app.use(require('./routes/index'));

// habilitar la carpeta public
// let publicPath = path.resolve(__dirname, '../public');
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});