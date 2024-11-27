import Cryptr from 'cryptr';
import 'dotenv/config';
import Redis from 'ioredis';

export const TOKEN_COOKIE = 'piano.token';
export const PELCRO_COOKIE = 'pelcro.user.auth.token';
export const cryptr = new Cryptr(process.env.ENCRYPT_SECRET ?? '');
export const redisClient = new Redis(6379, '127.0.0.1');
export const JWT_SECRET = process.env.JWT_SECRET ?? '';
