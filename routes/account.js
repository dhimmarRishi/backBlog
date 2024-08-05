const express = require('express')
const {handleLogin , handleRegister, getUserInfo} = require('../handlers/accountHandlers')
const getUser = require('../middlewares/auth')
const accountRouter = express.Router();

accountRouter.post('/login',handleLogin)
accountRouter.post('/register',handleRegister)
accountRouter.get('/profile', getUser , getUserInfo)

module.exports = accountRouter