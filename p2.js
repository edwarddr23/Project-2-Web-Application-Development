const pug = require('pug');
const express = require('express');
// require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');

const Database = require('./wdbcmps369');
const db = new Database();
db.initialize();

app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use('/', require('./routes/contact_list'));
app.use('/login', require('./routes/login'));
app.use('/create', require('./routes/create'));
app.use('/signup', require('./routes/signup'));

app.listen(3000, () => {
    console.log('Listening on port 3000...');
})