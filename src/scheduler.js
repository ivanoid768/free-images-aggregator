import { schedule } from 'node-cron';
import { pool } from 'workerpool';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllImagesData } from './download_from_source';
import { CONFIG } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool1 = pool(__dirname + '/workers/download_from_source_worker.js', { maxWorkers: CONFIG.UPDATE_IMAGE_DATA_WORKER_COUNT });

export function startScheduler() {
    schedule(CONFIG.UPDATE_CRON, () => {
        getAllImagesData(pool1)
        console.log('Images update scheduler started');
    }, {
        scheduled: true,
    });
}
