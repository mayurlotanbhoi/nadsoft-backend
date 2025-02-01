import cluster from 'cluster';
import { config } from 'dotenv';
import os from 'os';
import app from './app.js';
import path from 'path';
import connectToDb from './Db/index.js';



config({ path: path.resolve(process.cwd(), '.env') });
const port = process.env.PORT || 8880;
const numCPUs = os.cpus().length;

// if (cluster.isPrimary) {
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }
//     cluster.on('exit', (worker, code, signal) => {
//         console.error(`Worker ${worker.process.pid} exited with code ${code} (${signal || 'no signal'})`);
//         cluster.fork();
//     });
// } else {
//     const startServer = async () => {
//         try {
//             await connectToDb();
//             app.listen(port, () => {
//                 console.log(`Worker ${process.pid} is running on port ${port}`);
//             });
//         } catch (error) {
//             console.error(`Failed to connect to MongoDB: ${error.message}`);
//             process.exit(1);
//         }
//     };

//     startServer();
// }

const startServer = async () => {
    try {
        await connectToDb();
        app.listen(port, () => {
            console.log(`Worker ${process.pid} is running on port ${port}`);
        });
    } catch (error) {
        console.error(`Failed to connect to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

startServer();