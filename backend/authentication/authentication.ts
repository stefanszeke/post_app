import jwt from 'jsonwebtoken';


export default class Authentication {
  public static generateToken = (user: any) => {
    const payload = { id: user.id, name: user.name };
    const secret = process.env.JWT_SECRET || 'somethingsecret';
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
  }

  public static isAuth = (req: any, res: any, next: any) => {
    // Get token from header
    const authorization = req.headers.authorization;

    // Check if token exists
    if (authorization) {
        const token = authorization.slice(7, authorization.length); // Bearer XXXXXX

      // Verify token:
      jwt.verify(token, process.env.JWT_SECRET || 'somethingsecret', (err: any, decode: any) => {
        // Token is invalid:
        if (err) { res.status(401).send({ message: 'Invalid Token' }) }
        // Token is valid:
        else { req.user = decode; next()}
      });

    } else { res.status(401).send({ message: 'No Token' }) }
  }
}