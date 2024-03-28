const assert = require('assert');
const sqlite = require('sqlite-async');

class DataStore {
    constructor() {
        // Read Configuration
        this.path = process.env.DBPATH;
        assert(this.path !== undefined, "DBPATH not specified in environment.");
    }

    async connect() {
        this.db = await sqlite.open(this.path);
    }

    async schema(table, schema, pkey) {
        const sql = `CREATE TABLE IF NOT EXISTS "${table}" 
            (${schema.map(c => `"${c.name}" ${c.type}`).join(", ")}, 
            PRIMARY KEY ("${pkey}"))`;
        console.log(sql);
        await this.db.run(sql);
        return;
    }

    async create(table, data) {
        const params = Array(data.length).fill('?')
        const sql = `INSERT into ${table} (${data.map(d => d.column).join(',')}) values (${params.join(',')})`;
        console.log(sql, data.map(d => d.value));
        const result = await this.db.run(
            sql,
            data.map(d => d.value));
        return result.lastID;
    }

    /** This is limited to supporting direct match query parameters.
     *  Query is an array of column/value pairs
     */
    async read(table, query) {
        let sql = `SELECT * from ${table}`;
        if (query.length > 0) {
            sql += ` WHERE ${query.map(d => `${d.column} = ?`).join(' and ')}`
        }
        console.log(sql, query.map(d => d.value));
        return await this.db.all(
            sql, query.map(d => d.value)
        );
    }

    async update(table, data, query) {
        let sql = `UPDATE ${table} set ${data.map(d => `${d.column}=?`)} where ${query.map(d => `${d.column} = ?`).join(' and ')}`;
        const _data = data.map(d => d.value).concat(query.map(q => q.value));
        console.log(sql, _data);
        return await this.db.run(sql, _data)
    }

    async delete(table, query) {
        assert(query.length > 0, 'Deleting without query is a bad idea');
        let sql = `DELETE from ${table} WHERE ${query.map(d => `${d.column} = ?`).join(' and ')}`;
        console.log(sql, query.map(d => d.value));
        return await this.db.all(
            sql, query.map(d => d.value)
        );
    }
}

module.exports = DataStore;