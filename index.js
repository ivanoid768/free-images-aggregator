import { pool } from 'workerpool';
import path from 'path';
import { fileURLToPath } from 'url';
import { startAPI } from './api.js';
import { getAllImagesData } from './download_from_source.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

startAPI()

// create a worker pool using an external worker script
const pool1 = pool(__dirname + '/workers/download_from_source_worker.js', {maxWorkers: 3});

getAllImagesData(pool1)

// let taskResults = [];

// for (let i = 1; i <= 1; i++) {
//     // run registered functions on the worker via exec
//     let taskResult = pool1.exec('theWorker', [{source:SOURCE.PIXABAY, page: 1}])
//         .then(function (result) {
//             console.log(`Result: ${i} ` + result.images[0].imageURL + ' total: ' + result.total); // outputs 55
//             console.log(result.images[0]);
//             return result;
//         })
//         .catch(function (err) {
//             console.error(err);
//         })

//     taskResults.push(taskResult)
// }

// Promise.all(taskResults).then((results) => {
//     // console.log('All results:', results);
//     pool1.terminate()
// })
