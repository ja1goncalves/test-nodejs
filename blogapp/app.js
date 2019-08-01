//Carregando módulos
    const express = require('express')
    const bodyParser = require('body-parser')
    const handlebars = require('express-handlebars')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
    const adminRoute = require('./routes/admin')
    const Postagem = require('./models/Postagem')
    const Categoria = require('./models/Categoria')
    const usuarioRoute = require('./routes/usuario')
    const path = require('path')
    const passport = require('passport')
    require('./config/auth')(passport)
//Configurações de inicialização
    const app = express()
    //Sessão
        app.use(session({
            secret: 'çlvsblvfld',
            resave: true,
            saveUninitialized: true
        }))
    //Passport
        app.use(passport.initialize())
        app.use(passport.session())
    //Flash
        app.use(flash())
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
            next()
        })
    //Body Parser
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended: false}))
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost/blogapp', {useNewUrlParser: true})
        .then(() => {
            console.log('Conectado ao MongoDB')
        }).catch((err) => {
            console.log('Erro ao conectar ao banco: ' + err)
        })
    //Public
        app.use(express.static(path.join(__dirname, 'public')))

//Rotas
    app.get('/', (req, res) => {
        Postagem.find().sort({data: 'desc'}).populate('categoria')
        .then((postagens) => {
            res.render('index', {postagens: postagens})
        }).catch((err) => {
            res.send('ERROR: ' + err)
        })
        
    })

    app.get('/postagem/:slug', (req, res) => {
        Postagem.findOne({slug: req.params.slug})
        .then((postagem) => {
            if (postagem){
                res.render('postagens/index', {postagem: postagem})
            }else{
                req.flash('error_msg', 'Esssa postagem não exise')
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    })

    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({slug: req.params.slug})
        .then((categoria) => {
            Postagem.find({categoria: categoria._id})
            .then((postagens) => {
                res.render('postagens/postagens', {categoria: categoria, postagens: postagens})
            }).catch((err) => {
                res.render('/')
            })
        }).catch((err) => {
            req.flash('erro_msg', 'Categoria não existe')
            res.render('/')
        })
    })

    app.use('/admin', adminRoute)
    app.use('/usuarios', usuarioRoute)

//Outros
    PORT = 8000
    app.listen(PORT, () => {
        console.log('Server connect in port: ' + PORT)
    })