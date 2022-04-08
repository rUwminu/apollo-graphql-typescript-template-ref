import jwt from 'jsonwebtoken';
import { privateKey, publicKey } from '../../config';

export function signJwt(payload) {
  return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '5d' });
}

export function decode(token: string) {
  if (!token) return null;

  try {
    const decode = jwt.verify(token, publicKey);
    return decode;
  } catch (error) {
    console.log(`error`, error);
    return null;
  }
}
