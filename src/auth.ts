import { Router } from 'express';
import type { Request, Response } from 'express';
import { cryptr, JWT_SECRET, PELCRO_COOKIE, redisClient, TOKEN_COOKIE } from './constants';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import routeCache from 'route-cache';

const router = Router();

router.get('/user/:site', async (req: Request, res: Response) => {
    const { params: { site }} = req;
    if (!req.cookies[PELCRO_COOKIE]) {
        res.clearCookie(`${TOKEN_COOKIE}.${site}`);
        res.status(401).send('unauthorize');
        return
    }
    const tokenCookie = req.cookies[`${TOKEN_COOKIE}.${site}`];
    if (tokenCookie) {
        const id = cryptr.decrypt(tokenCookie).split(':').shift();
        console.log('id:', id);
        res.redirect(301, `/auth/user/${site}/${id}`);
    } else {
        // @todo pelcro api call to get uer info.
        const token = jwt.sign({id: 1, site}, JWT_SECRET, {expiresIn: '1h'});
        const result = await redisClient.set(`${site}:${1}`, token);
        if (result === 'OK') {
            res.cookie(`${TOKEN_COOKIE}.${site}`, cryptr.encrypt(`${1}:${site}`), {httpOnly: true});
            res.status(200).send(token);
        } else {
            res.status(500).send('something went wrong, try again');
        }

    }

});

router.get('/user/:site/:id', routeCache.cacheSeconds(60 * 60 * 60) ,async (req: Request, res: Response) => {
    const { params: {site, id }} = req;
    const redisKey = `${site}:${id}`;
    let token = await redisClient.get(redisKey);
    console.log('token:', token);
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            console.log('decoded:', decoded);
            if (err) {
                if (err instanceof TokenExpiredError && decoded) {
                    token = jwt.sign(decoded, JWT_SECRET, {expiresIn: '1h'});
                    redisClient.set(redisKey, token);
                } else {
                    token = null;
                }
            }
        });
    }
    if (token) {
        res.status(200).send(token);
    } else {
        res.status(400).send(`unable to find token for site, ${site}, id, ${id}`);
    }

});

export default router;