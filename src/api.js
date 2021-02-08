import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';

import { CONFIG } from './config.js';

let pgPool;

const app = express();
const corsOptions = { origin: CONFIG.CORS_ORIGIN || '*' };

app.use(urlencoded({ extended: true }));
app.use(json());

app.use(cors(corsOptions))

app.use(/^((?!admin).)*$/i, async (req, res, next) => {
    let configRes = await pgPool.query(`SELECT * FROM config;`)

    if (req.header('Authorization') === configRes.rows[0].user_api_token) {
        return next()
    }

    return res.sendStatus(403)
})

app.post('/admin/usertoken', async (req, res) => {
    if (req.body.password !== CONFIG.ADMIN_PASSWORD) {
        return res.sendStatus(403)
    }

    let newTokenForUsers = nanoid()

    await pgPool.query(`UPDATE config SET user_api_token = $1;`, [newTokenForUsers])

    return res.status(201).send({ newTokenForUsers })
})

app.get('/images', async (req, res) => {
    const PER_PAGE = 30;

    let page = req.query['page']
    let searchText = req.query['search']

    let imagesRes = await pgPool.query(`
        SELECT * FROM images WHERE search_text ILIKE '%${searchText}%' 
        LIMIT 30 
        OFFSET ${(page - 1) * PER_PAGE};
    `)

    res.send({ images: imagesRes.rows })
})

const port = 4000

async function startAPI(dbPool) {
    pgPool = dbPool;

    pgPool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    app.listen(port, () => {
        console.log(`Server is listening on ${port}`);
    })
}

export { startAPI }
