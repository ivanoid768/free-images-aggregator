import {env} from 'process';

if(!env.PIXABAY_API_KEY){
    console.warn(`NO_PIXABAY_API_KEY: Can't get image data from Pixabay`)
}

if(!env.UNSPLASH_API_KEY){
    console.warn(`NO_UNSPLASH_API_KEY: Can't get image data from Unsplash`)
}

if(!env.PEXELS_API_KEY){
    console.warn(`NO_PEXELS_API_KEY: Can't get image data from Pexels`)
}

export const SOURCE = {
    UNSPLASH: 'UNSPLASH',
    PIXABAY: 'PIXABAY',
    PEXELS: 'PEXELS',
}

export const CONFIG = {
    PIXABAY_API_KEY: env.PIXABAY_API_KEY,
    PIXABAY_LIMIT: 5000,
    UNSPLASH_API_KEY: env.UNSPLASH_API_KEY,
    UNSPLASH_LIMIT: 50,
    PEXELS_API_KEY: env.PEXELS_API_KEY,
    PEXELS_LIMIT: 200,

    CATEGORY: env.CATEGORY || 'robotics',
}
