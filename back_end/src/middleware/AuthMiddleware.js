const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const authMiddleware = (req,res,next) =>{
  const token = req.headers.token.split(' ')[1];
  jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
    if(err){
        return res.status(404).json({
            status: 'ERR',
            message: 'Invalid Token'
        })
    }

    if(user.isAdmin){
     next()
    }else{
        return res.status(404).json({
            status: 'ERR',
            message: 'The authenticated user is not an admin',
        })
    }
  })
}

const authUserMiddleware = (req, res, next) => {
    const authHeader = req.headers.token;
    console.log('authHeader in backend:',authHeader)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'ERR',
            message: 'No token provided or token format is invalid',
        });
    }



    const token = authHeader.split(' ')[1];
    const userId = req.params.id;
console.log('token in backend:',token)
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 'ERR',
                message: 'Invalid Token',
            });
        }

        if (user?.isAdmin || user?.id === userId) {
            next();
        } else {
            return res.status(403).json({
                status: 'ERR',
                message: 'User is not authorized',
            });
        }
    });
};

module.exports = authUserMiddleware;


module.exports = {
    authMiddleware,
    authUserMiddleware
}