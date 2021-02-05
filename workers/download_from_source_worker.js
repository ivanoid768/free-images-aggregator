import { worker } from 'workerpool';

import { theWorker } from '../download_from_source.js';

// create a worker and register public functions
worker({
    theWorker: theWorker
});
