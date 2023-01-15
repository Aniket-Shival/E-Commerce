const jwtDecode = require('jwt-decode')
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Parse = require('parse/node')
const User = require("../models/userSc")
require("dotenv").config();


const currentUser = (req, res, next) => {
    let token = req.cookies.token;
  
    if (token) {
      jwt.verify(token, process.env.TOKEN_KEY, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
        
          let user = await User.findById(decodedToken.user._id);
          res.locals.user = user
          
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };

  
module.exports = currentUser ;
