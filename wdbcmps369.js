require('dotenv').config();
const Database = require('dbcmps369');

class ContactsDB {
    constructor() {
        this.db = new Database();
    }

    async initialize() {
        await this.db.connect();

        await this.db.schema('Contact', [
            {name: 'id', type: 'INTEGER'},
            {name: 'f_name', type: 'TEXT'},
            {name: 'l_name', type: 'TEXT'},
            {name: 'phone', type: 'TEXT'},
            {name: 'email', type: 'TEXT'},
            {name: 'street', type: 'TEXT'},
            {name: 'city', type: 'TEXT'},
            {name: 'state', type: 'TEXT'},
            {name: 'zip', type: 'INTEGER'},
            {name: 'country', type: 'TEXT'},
            {name: 'contact_by_phone', type: 'BOOLEAN'},
            {name: 'contact_by_email', type: 'BOOLEAN'},
            {name: 'contact_by_mail', type: 'BOOLEAN'},
            {name: 'user_id', type: 'INTEGER'}
        ], 'id');

        await this.db.schema('Users', [
            {name: 'id', type: 'INTEGER'},
            {name: 'f_name', type: 'TEXT'},
            {name: 'l_name', type: 'TEXT'},
            {name: 'username', type: 'TEXT'},
            {name: 'password', type: 'TEXT'}
        ], 'id');

        const cmps369_found = await this.findUserByUsername('cmps369');
        // console.log('wdbcmps369: initialize(): thing:', thing);
        if(cmps369_found === undefined){
            const id = await this.createUser();
            await this.recordUser({username: 'cmps369', password: 'rcnj'}, id);
        }
    }

    async createContact() {
        // console.log('wdbcmps369: createContact(): body:', body);
        const id = await this.db.create('Contact', [
            {column: 'f_name', value: ''},
            {column: 'l_name', value: ''},
            {column: 'phone', value: ''},
            {column: 'email', value: ''},
            {column: 'street', value: ''},
            {column: 'city', value: ''},
            {column: 'state', value: ''},
            {column: 'zip', value: 0},
            {column: 'country', value: ''},
            {column: 'contact_by_phone', value: false},
            {column: 'contact_by_email', value: false},
            {column: 'contact_by_mail', value: false},
            {column: 'user_id', value: -1}
        ]);
        return id;
    }

    async createUser() {
        // console.log('wdbcmps369: createUser(): body:', body);
        const id = await this.db.create('Users', [
            {column: 'f_name', value: ''},
            {column: 'l_name', value: ''},
            {column: 'username', value: ''},
            {column: 'password', value: ''}
        ])
        return id;
    }

    async findContacts() {
        const contacts = await this.db.read('Contact', []);
        return contacts;
    }

    async findUserByUsername(username) {
        const us = await this.db.read('Users', [{column: 'username', value: username}]);
        // If found, return the username. Otherwise return undefined.
        if(us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    async recordContact(contact, id) {
        console.log('wdbcmps369: recordContact: contact:', contact);
        const parseCheckboxValue = (checkboxValue) => {
            if(checkboxValue === undefined) return false
            return true;
        }

        await this.db.update('Contact',
            [{column: 'f_name', value: contact.first},
            {column: 'l_name', value: contact.last},
            {column: 'phone', value: contact.phone},
            {column: 'email', value: contact.email},
            {column: 'street', value: contact.street},
            {column: 'city', value: contact.city},
            {column: 'state', value: contact.state},
            {column: 'zip', value: contact.zip},
            {column: 'country', value: contact.country},
            {column: 'contact_by_phone', value: parseCheckboxValue(contact.contact_by_phone)},
            {column: 'contact_by_email', value: parseCheckboxValue(contact.contact_by_email)},
            {column: 'contact_by_mail', value: parseCheckboxValue(contact.contact_by_mail)}],
            [{column: 'id', value: id}]
        );
    }

    async recordUser(user, id) {
        await this.db.update('Users', [
            {column: 'f_name', value: user.first},
            {column: 'l_name', value: user.last},
            {column: 'username', value: user.username},
            {column: 'password', value: user.password}],
        [{column: 'id', value: id}])
    }
}

module.exports = ContactsDB;