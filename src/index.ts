import express from 'express';
import type { NextFunction, Request, Response, Express } from 'express';
import Redis from 'ioredis';
import IoRedisStore from 'route-cache/ioRedisStore';
import routeCache from 'route-cache';

import taskRoutes from './tasks';
import invalidateRoutes from './invalidate';

const app: Express = express();
const port = process.env.PORT || 3000;

const redisClient = new Redis(6379, '127.0.0.1');
const cacheStore = new IoRedisStore(redisClient);
routeCache.config({cacheStore})

app.use(express.json());
app.use('/tasks', taskRoutes);
app.use('/invalidate', invalidateRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Typescript Express!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    res.status(500).send('Something went wrong');
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
