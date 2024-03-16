const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')

router.get('/logout', async(req, res) => {
    req.session.user = undefined;
    res.redirect('/');
})

router.get('/login', async(req, res) => {
    res.render('login', {hide_signin: true})
});

router.post('/login', async(req, res) => {
    const username = req.body.username.trim();
    const p1 = req.body.password.trim();
    const user = await req.db.findUserByUsername(username);
    // Test if username is correct and if password is correct.
    if(user && bcrypt.compareSync(p1, user.password)){
        req.session.user = user;
        res.redirect('/');
        return;
    }
    else{
        res.render('login', {hide_signin: true, message: 'Sorry, couldn\'t sign you in...'});
        return;
    }
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
    if(curr_us_found){
        res.render('signup', {hide_signin: true, message: 'An account with this username already exists'});
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    console.log('accounts.js: salt:', salt);
    // The salt is prepended to the hash in format [salt].[hash] by this function.
    const hash = bcrypt.hashSync(p1, salt);

    const id = await req.db.createUser();
    await req.db.recordUser(req.body, id, hash);

    // Start Session.
    req.session.user = await req.db.findUserById(id);

    res.redirect("/");
})

module.exports = router;