const pug = require('pug');
const express = require('express');
// require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }));

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

app.listen(3000, () => {
    console.log('Listening on port 3000...');
})