const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const Usuario = require('../models/Usuario')
const router = express.Router()

router.get('/add', (req, res) => {
    res.render('usuarios/registro')
})

router.post('/add', (req, res) => {
    const errors = []
    const user = Usuario.findOne({email: req.body.email}).then((user) => {
        if(user) errors.push({msg: "Já existe um usuário com esse email!"})
    })

    if(req.body.senha !== req.body.senha2) errors.push({msg: "Senhas diferem!"})
    if(req.body.senha.length < 5) errors.push({msg: "Senha fraca demais!"})
    
    if(errors.length > 0){
        res.render('usuarios/registro', {messages: errors})
    }else{
        const user = new Usuario({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha,
            admin: true
        })

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.senha, salt, (err, hash) => {
                if(err) req.flash('error_msg', 'Houve um erro ao salvar usuário!')

                user.senha = hash
                user.save().then(() => {
                    req.flash('success_msg', 'Usuário criado com sucesso!')
                    res.redirect('/')
                }).catch((err) => {
                    req.flash('erro_msg', 'Erro ao criar usuário!')
                    res.redirect('/usuarios/registro')
                })
            })
        })
    }
})

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success_msg', 'Até mais')
    res.redirect('/')
})

module.exports = router