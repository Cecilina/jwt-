import { Request, Response, Router } from 'express';
import routeCache from 'route-cache';

const router = Router();

router.get('/task/:id', (req: Request, res: Response) => {
    routeCache.removeCache(`/tasks/${req.params.id}`);
    routeCache.removeCache('/tasks');
    res.status(200).send(`invalidate cache for path /tasks/${req.params.id}`);
    return;
});

router.get('/auth/:site/:id', (req: Request, res: Response) => {
    const { params: { site, id }} = req;
    routeCache.removeCache(`/auth/user/${site}/${id}`);
    res.status(200).send(`invalidate cache for path /auth/${site}/${id}`);
})

export default router;