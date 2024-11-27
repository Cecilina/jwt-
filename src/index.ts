import express from 'express';
import type { NextFunction, Request, Response, Express } from 'express';
import IoRedisStore from 'route-cache/ioRedisStore';
import routeCache from 'route-cache';
import cookieParser from 'cookie-parser';

import taskRoutes from './tasks';
import authRoutes from './auth';
import invalidateRoutes from './invalidate';
import { redisClient } from './constants';

const app: Express = express();
const port = process.env.PORT || 3000;

const cacheStore = new IoRedisStore(redisClient);
routeCache.config({cacheStore});

app.use(cookieParser());
app.use(express.json());
app.use('/tasks', taskRoutes);
app.use('/invalidate', invalidateRoutes);
app.use('/auth', authRoutes);

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
