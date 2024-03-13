const pug = require('pug');
const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'cmps369',
    resave: false,
    saveUninitialized: true,
    // Cookies are not secured because my dev machine isn't running this on https.
    cookie: {secure: false}
}));

// Middleware that adds session object to every template's model.
app.use((req, res, next) => {
    if(req.session.user){
        res.locals.user = {
            id: req.session.user.id,
            f_name: req.session.user.f_name,
            l_name: req.session.user.l_name
        }
    }
    next();
});

app.set('view engine', 'pug');

app.locals.pretty = true;

const Database = require('./wdbcmps369');
const db = new Database();
db.initialize();

app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use('/', require('./routes/contact_list'));
app.use('/', require('./routes/accounts'));
app.use('/create', require('./routes/create'));
app.use('/', require('./routes/contact_id'))

app.listen(3000, () => {
    console.log('Listening on port 3000...');
})