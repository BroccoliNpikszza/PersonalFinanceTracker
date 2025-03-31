//jswebtokens
// role based access control

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const userToken = req.cookies.jwt;
    if(!userToken){
        return res.status(401).send("not authorized");
    }
    jwt.verify(userToken, process.env.JWT_KEY, async(err, payload) => {
        if(err){
            return res.status(403).send("Invalid Token");
        }
        req.userId = payload.userId;
        next();
    });

}
