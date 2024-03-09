const express = require('express')
const router = express.Router();

router.get('/', async(req, res) => {
    const contacts = await req.db.findContacts();
    console.log('contact_list.js: contacts:', contacts);
    res.render('contact_list', {contacts: contacts});
});

module.exports = router;