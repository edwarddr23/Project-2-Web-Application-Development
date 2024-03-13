const express = require('express')
const router = express.Router();

router.get('/', async(req, res) => {
    const contacts = await req.db.findContacts();
    res.render('contact_list', {contacts: contacts});
});

module.exports = router;