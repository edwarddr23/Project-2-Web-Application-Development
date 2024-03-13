const express = require('express')
const router = express.Router();

router.get('/', async(req, res) => {
    res.render('create', {});
});

router.post('/', async (req, res) => {
    const game_id = await req.db.createContact();
    // If the session user exists, then record that into user_id, otherwise set it to -1.
    const user_id = req.session.user ? req.session.user.id : -1;
    await req.db.recordContact(req.body, game_id, user_id);
    res.redirect("/");
});

module.exports = router;