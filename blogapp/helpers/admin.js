module.exports = {
    admin: (req, res, next) => {
        if(req.isAuthenticated() && req.user.admin){
            return next()
        }

        req.flash('error_msg', 'Voce deve ser admin para entrar lá')
        res.redirect('/')
    }
}