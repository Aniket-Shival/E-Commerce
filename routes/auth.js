const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authorizeUser = (req, res, next) => {
  let token = req.cookies.token;

  try {
    if (token === "null" || !token)
      return res.redirect('/login')
    let verifiedUser = jwt.verify(token, process.env.TOKEN_KEY);
    if (!verifiedUser) {
      return res.status(401).send("Only registered users can access");
    } else {
      req.user = verifiedUser;

      next();
    }
  } catch (error) {
    res.redirect('/login')
  }
};



module.exports = authorizeUser ;

