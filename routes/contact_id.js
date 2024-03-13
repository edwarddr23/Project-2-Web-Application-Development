const express = require('express')
const router = express.Router();

const logged_in = (req, res, next) => {
    if(req.session.user) {
        next();
    }
    else {
        res.status(401).send("Not authorized");
    }
}

router.get('/:contact_id', async(req, res) => {
    console.log('contact_id.js: GET(): req.params', req.params);
    const contact = await req.db.findContactById(req.params.contact_id);
    // console.log('contact_id.js: GET(): contact:', contact);
    // req.session.id
    res.render('contact_info', {contact: contact});
})

router.get('/:contact_id/edit', logged_in, async(req, res) => {
    const contact = await req.db.findContactById(req.params.contact_id);
    res.render('edit', {contact: contact})
})

router.post('/:contact_id/edit', logged_in, async(req, res) => {
    console.log('contact_id.js: POST(): req.params:', req.params);
    const contact = await req.db.findContactById(req.params.contact_id);
    // console.log('contact_id.js: POST(): contact:', contact);
    await req.db.recordContact(req.body, req.params.contact_id, contact.user_id)
    res.redirect('/' + contact.id);
})

router.get('/:contact_id/delete', logged_in, async(req, res) => {
    const contact = await req.db.findContactById(req.params.contact_id);
    console.log('contact_id.js: delete GET(): req.params:', req.params);
    res.render('delete', {contact: contact});
})

router.post('/:contact_id/delete', logged_in, async(req, res) => {
    // console.log('contact_id.js: delete POST(): req.params:', req.params);
    const contact = await req.db.findContactById(req.params.contact_id);
    // console.log('contact_id.js: delete POST(): contact:', contact);
    await req.db.deleteContactById(contact.id);
    res.redirect('/');
})

module.exports = router;