const express = require('express')
const router = express.Router();

router.get('/', async(req, res) => {
    res.render('login', {hide_signin: true})
});

module.exports = router;