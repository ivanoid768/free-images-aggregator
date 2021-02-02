import pkg from 'pg';
import { CONFIG } from './config.js';

const { Client } = pkg;

const client = new Client({
    connectionString: CONFIG.PG_DB_CONNECTION_URI,
})

async function createImageTable() {
    await client.connect()

    let text = `
        CREATE TABLE IF NOT EXISTS images (
            image_id integer CONSTRAINT firstkey PRIMARY KEY,
            source_name varchar(50) NOT NULL,
            image_url varchar NOT NULL,
            search_text varchar NOT NULL,
            user_id integer,
            username varchar(100),
            page_url varchar
        );
    `

    const res = await client.query(text)
    console.log(res.command)
    await client.end()
}

createImageTable().then(() => {
    console.log('createImageTable created');
}).catch(err => {
    console.log('createImageTable: err', err);
})
