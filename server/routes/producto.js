const express = require('express');
const Producto = require('../models/producto');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');


const app = express();

app.get('/producto', verificaToken, function(req, res) {

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .limit(limite)
        .skip(desde)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            };

            Producto.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    registrosBD: conteo
                });
            });
        });
});

app.get('/producto/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                })
            };

            res.json({
                ok: true,
                producto: productoDB,
            });
        });
});


app.get('/producto/buscar/:termino', verificaToken, function(req, res) {

    let termino = req.params.termino;
    let regExp = new RegExp(termino, 'i');

    Producto.find({ nombre: regExp })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontraron resultados con el termino de busqueda'
                    }
                })
            };

            res.json({
                ok: true,
                productos
            });
        });
});


app.post('/producto', verificaToken, function(req, res) {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no se pudo crear verifique e intente nuevamente'
                }
            })
        };

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

app.put('/producto/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'img']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no se encontro, verifique el ID e intente de nuevo'
                }
            })
        };

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

app.delete('/producto/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    let cambioDeDisponible = { disponible: false };

    Producto.findByIdAndUpdate(id, cambioDeDisponible, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

module.exports = app;