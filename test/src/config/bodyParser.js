module.exports = (app, bodyParser) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
}