const express = require('express')
const router = express.Router();

router.get('/', async(req, res) => {
    res.render('create', {});
});

router.post('/', async (req, res) => {
    const id = await req.db.createContact();
    await req.db.recordContact(req.body, id);
    res.redirect("/");
});

module.exports = router;