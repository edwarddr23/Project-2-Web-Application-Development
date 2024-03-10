const express = require('express')
const router = express.Router();

router.get('/login', async(req, res) => {
    res.render('login', {hide_signin: true})
});

router.post('/login', async() => {
    console.log('accounts.js: loggin in?');
})

router.get('/signup', async(req, res) => {
    res.render('signup', {hide_signin: true})
});

router.post('/signup', async(req, res) => {
    const f_name = req.body.first.trim();
    const l_name = req.body.last.trim();
    const username = req.body.username.trim();
    const p1 = req.body.password.trim();
    const p2 = req.body.password2.trim();
    
    // Check if the password entered twice is consistent.
    if(p1 != p2) {
        res.render('signup', {hide_signin: true, message: 'Passwords do not match!'});
        return;
    }
    
    // Check if the submitted username is already in the DB. If so, it will rerender the same page but let the user know that username exists already.
    const curr_us_found = await req.db.findUserByUsername(username);
    if(curr_us_found !== undefined){
        res.render('signup', {hide_signin: true, message: 'An account with this username already exists'});
        return;
    }

    const id = await req.db.createUser(req.body);
    await req.db.recordUser(req.body, id);
    res.redirect("/");
})

module.exports = router;