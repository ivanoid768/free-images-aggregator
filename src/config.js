import { env } from 'process';
import { cpus } from 'os'

if (!env.PIXABAY_API_KEY) {
    console.warn(`NO_PIXABAY_API_KEY: Can't get image data from Pixabay`)
}

if (!env.UNSPLASH_API_KEY) {
    console.warn(`NO_UNSPLASH_API_KEY: Can't get image data from Unsplash`)
}

if (!env.PEXELS_API_KEY) {
    console.warn(`NO_PEXELS_API_KEY: Can't get image data from Pexels`)
}

export const SOURCE = {
    UNSPLASH: 'UNSPLASH',
    PIXABAY: 'PIXABAY',
    PEXELS: 'PEXELS',
}

export const CONFIG = {
    PIXABAY_API_KEY: env.PIXABAY_API_KEY,
    PIXABAY_LIMIT: parseInt(env.PIXABAY_LIMIT) || 5000,
    UNSPLASH_API_KEY: env.UNSPLASH_API_KEY,
    UNSPLASH_LIMIT: parseInt(env.UNSPLASH_LIMIT) || 50,
    PEXELS_API_KEY: env.PEXELS_API_KEY,
    PEXELS_LIMIT: parseInt(env.PEXELS_LIMIT) || 200,

    CATEGORY: env.CATEGORY || 'robotics',

    PG_DB_CONNECTION_URI: env.DB_CONNECTION_URI || `postgresql://postgres:password@localhost:5432/free_photo_aggr`,

    CORS_ORIGIN: env.CORS_ORIGIN || '*',

    ADMIN_PASSWORD: env.ADMIN_PASSWORD || 'password123',

    UPDATE_IMAGE_DATA_WORKER_COUNT: parseInt(env.UPDATE_IMAGE_DATA_WORKER_COUNT) || cpus().length - 1,

    UPDATE_CRON: env.UPDATE_CRON || '0 * * * *', // Every hour by default
}

console.log(CONFIG);