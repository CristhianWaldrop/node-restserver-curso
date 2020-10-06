const express = require('express');
const Categoria = require('../models/categoria');
const _ = require('underscore');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');


const app = express();

app.get('/categoria', verificaToken, function(req, res) {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            };

            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    registrosBD: conteo
                });
            });
        });
});

app.get('/categoria/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            })
        };

        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });
});


app.post('/categoria', verificaToken, function(req, res) {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no se pudo crear verifique e intente nuevamente'
                }
            })
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, 'descripcion');

    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no se encontro, verifique el ID e intente de nuevo'
                }
            })
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        };

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;