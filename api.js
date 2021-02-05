import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import pkg from 'pg';

import { CONFIG } from './config.js';

const { Client } = pkg;

const client = new Client({
    connectionString: CONFIG.PG_DB_CONNECTION_URI,
})

const app = express();
const corsOptions = { origin: CONFIG.CORS_ORIGIN || '*' };

app.use(urlencoded({ extended: true }));
app.use(json());

app.use(cors(corsOptions))

app.use(async (req, res, next) => {
    await client.connect()
    let configRes = await client.query(`SELECT * FROM config;`)
    await client.end()

    if (req.header('Authentication') === configRes.rows[0].user_api_token) {
        return next()
    }

    return res.sendStatus(403)
})

app.post('/admin/usertoken', async (req, res) => {
    if (req.body.password !== CONFIG.ADMIN_PASSWORD) {
        return res.sendStatus(403)
    }

    let newTokenForUsers = nanoid()

    await client.connect()
    await client.query(`UPDATE config SET user_api_token = $1;`, [newTokenForUsers])
    await client.end()

    return res.status(201).send({ newTokenForUsers })
})

app.get('/images', async (req, res) => {
    const PER_PAGE = 30;

    let page = req.query['page']
    let searchText = req.query['search']

    await client.connect()
    let imagesRes = await client.query(`
        SELECT * FROM images WHERE search_text ILIKE '%${searchText}%' 
        LIMIT 30 
        OFFSET ${(page - 1) * PER_PAGE};
    `)
    await client.end()

    res.send({ images: imagesRes.rows })
})

const port = 4000

function startAPI() {
    app.listen(port, () => {
        console.log(`Server is listening on ${port}`);
    })
}

export { startAPI }
