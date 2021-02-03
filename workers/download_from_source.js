import { worker } from 'workerpool';
import fetch from 'node-fetch';
import pkg from 'pg';

import { CONFIG, SOURCE } from '../config.js';

const { Client } = pkg;

const client = new Client({
    connectionString: CONFIG.PG_DB_CONNECTION_URI,
})

async function GetImageDataFromPixabay({ page }) {
    let url = `https://pixabay.com/api/?key=${CONFIG.PIXABAY_API_KEY}&q=${CONFIG.CATEGORY}&page=${page}&per_page=200`
    console.log('url: ', url);
    let res = await fetch(url)
    console.log(res.status, res.statusText);

    if (res.status == 502) {
        console.log('res.text: ', await res.text());

        return {
            images: [],
            total: 0,
        }
    }

    let image_data = await res.json();

    let images = image_data.hits.map(hit => {
        return {
            source: SOURCE.PIXABAY,
            id: hit.id,
            imageURL: hit.largeImageURL,
            searchText: `${hit.tags} ${hit.pageURL}`,
            userId: hit.user_id,
            username: hit.user,
            pageURL: hit.pageURL,
        }
    })

    let total = image_data.totalHits;

    console.log('totalHits: ', image_data.totalHits, 'total', image_data.total);

    return {
        images,
        total,
    }
}

async function GetImageDataFromUnsplash({ page }) {
    return {
        images: [],
        total: 0,
    }
}

async function GetImageDataFromPexels({ page }) {
    return {
        images: [],
        total: 0,
    }
}

function GetImageFromSource({ source, page }) {
    switch (source) {
        case SOURCE.PIXABAY:
            return GetImageDataFromPixabay({ page })
        case SOURCE.UNSPLASH:
            return GetImageDataFromUnsplash({ page })
        case SOURCE.PEXELS:
            return GetImageDataFromPexels({ page })
        default:
            throw new Error(`unknown_source: ${source}`)
    }
}

async function saveImagesToDB(images) {
    await client.connect()

    // let insertText = `INSERT INTO distributors (did, dname)
    // VALUES (5, 'Gizmo Transglobal'), (6, 'Associated Computing, Inc')
    // ON CONFLICT (did) DO UPDATE SET dname = EXCLUDED.dname;`

    // INSERT INTO films (code, title, did, date_prod, kind) VALUES
    // ('B6717', 'Tampopo', 110, '1985-02-10', 'Comedy'),
    // ('HG120', 'The Dinner Game', 140, DEFAULT, 'Comedy');

    // source: SOURCE.PIXABAY,
    // id: hit.id,
    // imageURL: hit.largeImageURL,
    // searchText: `${hit.tags} ${hit.pageURL}`,
    // userId: hit.user_id,
    // username: hit.user,
    // pageURL: hit.pageURL,

    let valuesText = images.map(image=>{
        return `(${image.id},'${image.source}','${image.imageURL}','${image.searchText}',${image.userId},'${image.username}','${image.pageURL}')`
    }).join(',')

    let updateValuesText = `(EXCLUDED.source_name, EXCLUDED.image_url, EXCLUDED.search_text, EXCLUDED.user_id, EXCLUDED.username, EXCLUDED.page_url)`

    let insertText = `
        INSERT INTO images (image_id, source_name, image_url, search_text, user_id, username, page_url)
        VALUES ${valuesText}
        ON CONFLICT (image_id) DO UPDATE SET (source_name, image_url, search_text, user_id, username, page_url) = ${updateValuesText};
    `

    console.log('insertText: ', insertText);

    const res = await client.query(insertText)
    console.log(res.command, res)
    await client.end()
}

async function theWorker({ source, page }) {
    let imagesResp = await GetImageFromSource({ source, page })
    await saveImagesToDB(imagesResp.images)

    return imagesResp;
}

// create a worker and register public functions
worker({
    theWorker: theWorker
});
