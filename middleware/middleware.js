const jwt = require('jsonwebtoken');

async function authenticationCheck(req, res, next){
    const token = req.headers['authorization'];
    if(!token) {
        return res.status(401).send("Missing authorization token")
    }
    
    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user)=>{
        if(err) {
            return res.status(403).send("Invalid token")
        }
        req.employee = user;
        next()
    })
}

module.exports = {authenticationCheck}