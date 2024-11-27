import { Request, Response, Router } from 'express';
import routeCache from 'route-cache';

const router = Router();

router.get("/:id", (req: Request, res: Response) => {
    routeCache.removeCache(`/tasks/${req.params.id}`);
    routeCache.removeCache('/tasks');
    res.status(200).send(`invalidate cache for path /tasks/${req.params.id}`);
    return;
})

export default router;