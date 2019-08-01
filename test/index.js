const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const Post = require('./src/models/post');

const app = express();

require('./src/config/bodyParser')(app, bodyParser);
require('./src/config/handlebars')(app, handlebars);

app.get("/", (req, res) => {
    Post.findAll({order: [['id', 'DESC']]})
    .then((posts) => {
        res.render('home', {posts});
    }).catch((err) => {
        res.send('ERROR: '+ err)
    })
})

app.get("/create", (req, res) => {
    res.render('form');
})

app.post("/add", (req, res) => {
    Post.create({
        title: req.body.title,
        description: req.body.description
    }).then(() => {
        res.redirect('/');
    }).catch((err) => {
        res.send("ERROR: "+ err)
    })
})

app.get('/delete/:id', (req, res) => {
    Post.destroy({where: {id: req.params.id}})
    .then(() => {
        res.redirect('/')
    }).catch((err) => {
        res.send('ERROR: '+ err)
    })
})

// app.get("/:name", (req, res) => {
//     var html = "/html";
//     html += req.params.name != 'joao' ? '/index.html' : '/name.html';
//     res.sendFile(__dirname + html);
// });

app.listen(8000, () => {
    console.log("Servidor conectado!");
});
