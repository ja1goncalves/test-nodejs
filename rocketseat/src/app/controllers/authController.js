const configApp = require('../config/app.json');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer')
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
    const {email} = req.body;

    try{
        if(await User.findOne({email}))
            return res.status(400).send({error: 'User already exists'});

        const user = await User(req.body);

        user.password = undefined;
        
        return res.send({user, token: createToken({id: user.id})});
    }catch (error){
        return res.status(400).send({error: 'Registration failed'});
    }
});

router.post('/authentication', (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email}).select('+password');

    if(!user) return res.status(404).send({error: "User nod found"});

    if(!await bcrypt.compare(user.password, password))
        return res.status(500).send({error: "Passowrd incorrect"});

    user.password = undefined;
    
    return res.send({user, token: createToken({id: user.id})});
});

router.post('/forgot_password', async (req, res) => {
    const {email} = req.body;

    try{
        const user = await User.findOne({ email });

        if(!user) return res.status(404).send({error: "User nod found"});

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });

        mailer.sendMail({
            to: email,
            from: 'jpgonca17@gmail.com',
            template: 'auth/forgot_password',
            context: {token},
        }, (err) => {
            if(err) return res.status(400).send({ error: 'Can not send forgot password'})

            return res.send();
        });

    }catch (err){
        return res.status(400).send({error: 'Failed forgot password'});
    }
});

router.post('/reset_password', async (req, res) => {
    const {email, new_password, token} = req.body;

    try{
        const user = await User.findOne({email})
        .select('+passwordResetExpires passwordResetToken');
    
        if(!user) return res.status(404).send({error: "User nod found"});
    
        if(token !== user.passwordResetToken)
            return res.status(400).send({error: "Token invalid for reset passowrd"});
    
        const now = new Date();
    
        if(now > user.passwordResetExpires)
            return res.status(400).send({error: "Token expired for reset passowrd"});
    
        user.password = new_password;
    
        await user.save();
    
        res.send();
    }catch (err){
        return res.status(400).send({error: 'Failed reset password'});
    }
});

function createToken(params = {}){
    return jwt.sign(params, configApp.secret, {expiresIn: 86400});
}

module.exports = (app) => app.use('/auth', router)