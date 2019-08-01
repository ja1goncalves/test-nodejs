const express = require('express');
const Categoria = require('../models/Categoria')
const Postagem = require('../models/Postagem')
const {admin} = require('../helpers/admin')

const router = express.Router();

router.get('/', admin, (req, res) => {
    res.render('admin/index')
})

router.get('/categorias', admin, (req, res) => {
    Categoria.find().sort({data: 'desc'}).then((categorias) =>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar categorias!')
        res.redirect('/admin')
    })
})

router.get('/categorias/add', admin, (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/add', admin, (req, res) => {
    const {nome, slug} = req.body
    var errors = []

    if(!nome || typeof nome === undefined || nome  === null) errors.push({msg: "Nome inválido"})
    if(!slug || typeof slug === undefined || slug  === null) errors.push({msg: "Slug inválido"})

    if(errors.length > 0){
        res.render('admin/addcategorias', {messages: errors})
    }else{
        new Categoria({nome: nome, slug: slug}).save()
        .then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao criar categoria, tente novamente!')
            res.redirect('/admin')
        })
    }
})

router.get('/categorias/edit/:id', admin, (req, res) => {
    Categoria.findOne({_id: req.params.id}).then((categoria) => {
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((err) => {
        req.flash('error_msg', 'Categoria não existe')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', admin, (req, res) => {
    const {id, nome, slug} = req.body
    Categoria.findByIdAndUpdate(id, {nome: nome, slug: slug})
    .then(() => {
        req.flash('success_msg', 'Categorial editada com sucess!')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao editar categoria!')
        res.redirect('/admin/categorias')
    })
})

router.get('/categorias/delete/:id', admin, (req, res) => {
    Categoria.findByIdAndDelete(req.params.id)
    .then(() => {
        req.flash('success_msg', 'Categoria deletado com sucesso')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao deletar categoria')
        res.redirect('/admin/categorias')
    })
})

router.get('/postagens', admin, (req, res) => {
    Postagem.find().sort({data: 'desc'}).populate('categoria').then((postagens) => {
        res.render('admin/postagens', {postagens: postagens})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar postagens!')
        res.redirect('/admin')
    })
})

router.get('/postagens/add', admin, (req, res) => {
    Categoria.find().sort({data: 'desc'}).then((categorias) =>{    
        res.render('admin/addpostagens', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar categorias!')
        res.redirect('/admin')
    })
})

router.post('/postagens/add', admin, (req, res) => {
    var errors = []

    if(req.body.categoria === 0)
        errors.push({msg: "Não é possível adicionar postagem sem categoria."})

    if(errors.length > 0){
        res.render('admin/addpostagens', {messages: errors})
    }else{
        new Postagem(req.body).save()
        .then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao criar postagem, tente novamente!')
            res.redirect('/admin/postagens')
        })
    }

})

router.get('/postagens/edit/:id', admin, (req, res) => {
    const categorias = Categoria.find()
    Postagem.findOne({_id: req.params.id}).populate('categoria').then((postagem) => {
        Categoria.find().sort({data: 'desc'}).then((categorias) =>{    
            res.render('admin/editpostagens', {postagem: postagem, categorias: categorias})
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao listar categorias!')
            res.redirect('/admin')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Postagem não existe')
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/edit', admin, (req, res) => {
    Postagem.findByIdAndUpdate(req.body.id, req.body)
    .then(() => {
        req.flash('success_msg', 'Postagem editada com sucess0!')
        res.redirect('/admin/postagens')
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao editar postagem!')
        res.redirect('/admin/postagens')
    })
})

router.get('/postagens/delete/:id', admin, (req, res) => {
    Postagem.findByIdAndDelete(req.params.id)
    .then(() => {
        req.flash('success_msg', 'Postagem deletado com sucesso')
        res.redirect('/admin/postagens')
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao deletar postagem')
        res.redirect('/admin/postagens')
    })
})

module.exports = router;