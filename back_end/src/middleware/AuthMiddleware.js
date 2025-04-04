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
    const {payload} = user;
    if(payload.isAdmin){
     next()
    }else{
        return res.status(404).json({
            status: 'ERR',
            message: 'The authenticated user is not an admin',
        })
    }
  })
}

const authUserMiddleware = (req,res,next) =>{
    const token = req.headers.token.split(' ')[1];
    const userId = req.params.id;
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
        if(err){
            return res.status(404).json({
                status: 'ERR',
                message: 'Invalid Token'
            })
        }
        const {payload} = user;
        if(payload?.isAdmin || payload?.id === userId){
            next()
        }else{
            
            return res.status(200).json({
                status: 'OK',
                message: 'welcome Admin',
                data: payload
            })
        }
    })
}

module.exports = {
    authMiddleware,
    authUserMiddleware
}