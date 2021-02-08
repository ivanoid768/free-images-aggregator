import pg from 'pg';

import { startAPI } from './src/api.js';
import { startScheduler } from './src/scheduler.js';
import { CONFIG } from './src/config.js';

const { Pool } = pg;

const pgPool = new Pool({
    connectionString: CONFIG.PG_DB_CONNECTION_URI,
    max: CONFIG.UPDATE_IMAGE_DATA_WORKER_COUNT,
})

async function main() {
    startScheduler()
    startAPI(pgPool)
}

main().catch(err => console.log(err))
