import pkg from 'pg';
import { CONFIG } from './config.js';

const { Client } = pkg;

const client = new Client({
    connectionString: CONFIG.PG_DB_CONNECTION_URI,
})

async function createImageTable() {
    await client.connect()

    let imagesTableText = `
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

    const res = await client.query(imagesTableText)
    console.log(res.command)

    let configTableText = `
        CREATE TABLE IF NOT EXISTS config (
            user_api_token varchar(50) NOT NULL,
        );
    `

    const configTableRes = await client.query(configTableText)
    console.log(configTableRes.command)

    // Create extension to speed up text search
    await client.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;')
    await client.query('CREATE INDEX IF NOT EXISTS trgm_idx_image_search_text ON images USING gin (search_text gin_trgm_ops);')

    await client.end()
}

createImageTable().then(() => {
    console.log('createImageTable created');
}).catch(err => {
    console.log('createImageTable: err', err);
})
