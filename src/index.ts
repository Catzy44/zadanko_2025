import express, {Request,Response,NextFunction} from 'express'
import { MongoClient, ServerApiVersion } from 'mongodb';
import { exit } from 'process';
import logger from './logger';
import dotenv from 'dotenv';
import { Server } from 'http';

const bootstrap = async () => {
    dotenv.config();

    const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;
    const DATABASE_NAME = "sample_mflix";

    let nodeServer : Server | null = null

    const logError = (err: Error) => {
        logger.error(`Error: ${err.message}`)
        logger.error(err.stack ?? "-- no stacktrace --")
    }

    const shutdownApplication = async ()=> {
        logger.warn("Stopping...")
        if(nodeServer != null) nodeServer.close()
        try {if(mongoClient != null) await mongoClient.close()} catch(err: unknown) {}
        process.exit(0)
    }
    process.on("SIGINT", shutdownApplication)

    const app = express()

    const mongoClient = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          deprecationErrors: true,
        }
    });

    try {
        await mongoClient.connect()
    } catch (err: any) {
        logger.error("Failed to connect to MongoDB")
        logError(err)
        shutdownApplication()
    }
    logger.info("MongoDB Connected!")

    const db = mongoClient.db(DATABASE_NAME);
    const moviesCollection = db.collection("embedded_movies");

    app.use(express.json())

    app.get('/find', async (req: Request, res: Response)=>{

        const queryVectors: Array<number> = req.body?.plot ?? null
        const candidates = req.body?.candidates ?? 1536

        const pipeline = [
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "plot_embedding",
                    queryVector: queryVectors,
                    numCandidates: candidates,
                    limit: candidates
                }
            },
            { $match: { year: { $lt: 1950 } } },
            { $limit: 10 },
            {
                $project: { 
                    title: 1, 
                    plot: 1, 
                    score: { $meta: "vectorSearchScore" } 
                } 
            }
        ];

        const data = await moviesCollection.aggregate(pipeline).toArray();

        res.json({ status: "ok", data })

    })

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        logError(err)
        res.status(500).send('Server error, for more info check logs')
        next()
    })

    nodeServer = app.listen(3000, () => {
        console.log('Server is running on port 3000')
    });
}

bootstrap()