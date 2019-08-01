const localStrategy = require('passport-local').Strategy
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')

module.exports = (passport) => {
    passport.use
    (new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
        Usuario.findOne({email: email}).then((usuario) => {
            if(!usuario) return done(null, false, {message: 'Esta conta não existe'})

            bcrypt.compare(senha, usuario.senha, (err, batem) => {
                if(batem) done(null, usuario)
                else done(null, false, {message: 'Senha incorreta'})
            })
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    })
}