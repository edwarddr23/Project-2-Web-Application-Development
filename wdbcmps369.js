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
        ], 'id');
    }

    async createContact(body) {
        console.log('wdbcmps369: body:', body);
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
        ]);
        // console.log('wdbcmps369: createContact(): id:', id);
        return id;
    }

    // async findContact(id) {
    //     console.log('findContact(): id:', id);
    //     const contacts = await this.db.read('Contact', [{column: 'id', value: id}]);
    //     if(contacts.length > 0) return contacts[0];
    //     else return undefined;
    // }

    async findContacts() {
        const contacts = await this.db.read('Contact', []);
        return contacts;
    }

    async recordContact(contact, id) {
        console.log('wdbcmps369: recordContact: contact:', contact);
        const parseCheckboxValue = (checkboxValue) => {
            if(checkboxValue == undefined) return false
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
}

module.exports = ContactsDB;