const express = require('express')
const router = express.Router();

router.get('/', async(req, res) => {
    res.render('signup', {hide_signin: true})
});

router.post('/', async(req, res) => {
    console.log('signup.js: submitting nothing!');
})

module.exports = router;