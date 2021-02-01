import { worker } from 'workerpool';
import fetch from 'node-fetch';

import { CONFIG, SOURCE } from '../config.js';

// a deliberately inefficient implementation of the fibonacci sequence
function fibonacci(n) {
    if (n < 2) return n;
    return fibonacci(n - 2) + fibonacci(n - 1);
}

async function GetImageDataFromPixabay({ page }) {
    let url = `https://pixabay.com/api/?key=${CONFIG.PIXABAY_API_KEY}&q=${CONFIG.CATEGORY}&page=${page}&per_page=200`
    console.log('url: ', url);
    let res = await fetch(url)
    console.log(res.status, res.statusText);

    if(res.status == 502){
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

    console.log('totalHits: ' , image_data.totalHits, 'total', image_data.total);

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

function theWorker({ source, page }) {
    return GetImageFromSource({ source, page })
}

// create a worker and register public functions
worker({
    theWorker: theWorker
});
