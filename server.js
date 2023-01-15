const express = require("express");
const mongoose = require("mongoose");
const cartRouter = require("./routes/cart");
const successRouter = require('./routes/success');
const failureRouter = require('./routes/failure');
const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const profileRouter = require("./routes/profile");

const Product = require("./models/productSC");
const User = require("./models/userSc");
const Cart = require("./models/cartSC");
const Buy = require('./models/buySC')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authorizeUser = require("./routes/auth");
const stripe = require('stripe')(process.env.SECRET_KEY)

require("dotenv").config();

const YOUR_DOMAIN = 'http://localhost:3000';
const domain = process.env.DOMAIN
const publisherKey = process.env.PUBLISHER_KEY


const { urlencoded, json } = require("express");
const currentUser = require("./routes/currentUser");

const app = express();

mongoose.connect("mongodb://localhost:27017/GameShop");

app.set("view engine", "ejs");

app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/cart", cartRouter);
app.use("/suc", successRouter);
app.use("/fail", failureRouter);
app.use("/user", userRouter);
app.use("/login", loginRouter);
app.use("/profile", profileRouter);

// Home page

app.get("/", authorizeUser, currentUser, (req, res) => {
    Product.find({}, (err, data) => {
        res.render("home", { data: data });
    });
});


// Create new user profile

app.post("/user", currentUser, async (req, res) => {
    try {
        const { username, useraddress, userphone, useremail, userpassword } =
            req.body;
        if (!(username && useraddress && userphone && useremail && userpassword)) {
            return res.status(400).send("All fields need to be filled");
        }
        const existingemail = await User.findOne({ useremail });
        if (existingemail) {
            return res.send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(req.body.userpassword, 10);
        const user = await User.create({
            username: req.body.username,
            useraddress: req.body.useraddress,
            userphone: req.body.userphone,
            useremail: req.body.useremail,
            userpassword: hashedPassword,
        });
        const token = jwt.sign({ user }, process.env.TOKEN_KEY, {
            expiresIn: "1h",
        });
        res.cookie("token", token, { httpOnly: true });
        res.send("Profile was saved");
    } catch (error) {
        res.send("Some error occured, please try again");
    }
});

// add to cart

app.post("/cart", authorizeUser, currentUser, async (req, res) => {
  

    const userExists = await Cart.findOne({useremail:req.body.useremail });
    const itemExists = await Cart.findOne({ name: req.body.name , useremail:req.body.useremail  });
     

if(!itemExists){
    if(!userExists){
        const data = new Cart(req.body)
        data.save()
        res.send("Added to cart")
       }
       if(userExists){
        const data = await Cart.updateMany({useremail:req.body.useremail},{$push:{
             name:req.body.name,
             price:req.body.price,
             quantity:req.body.quantity
     }})
     res.send("Another added")
       }
}
if(itemExists){
    if(!userExists){
        const data = new Cart(req.body)
        data.save()
        res.send("Added to cart")
       }
    
       if(userExists ){
        
       
     res.send("Already")
       }

}

});


    app.post("/remove", authorizeUser, currentUser, async (req, res) => {
      
         console.log(req.user.user.useremail  )
         const p = req.user.user.useremail + ' '
          
        const data = await Cart.findOneAndDelete({useremail:p})
        console.log(data)
    res.redirect('/cart')
    
    });




    // user login 

    app.post("/login", async (req, res) => {
        const body = req.body;
        const user = await User.findOne({ useremail: body.useremail });
        if (user) {
            const validPassword = await bcrypt.compare(
                body.userpassword,
                user.userpassword
            );
            if (!validPassword) {
                res.status(200).send("Make sure Email and Password are correct");
            } else {
                const token = jwt.sign({ user }, process.env.TOKEN_KEY, {
                    expiresIn: "1h",
                });
                res.cookie("token", token, { httpOnly: true });
                res.send("Welcome");
                
            }
        } else {
            res
                .status(401)
                .send(
                    "Profile dosn't exist , check your details or signup with new account"
                );
        }
    });


    // logout

    app.post('/logout', async(req,res)=>{
        res.clearCookie('token')
        res.redirect('login')
    })


    // BUY


    app.post("/buy", authorizeUser, currentUser,async (req,res)=>{
      
            const p =  await new Buy(req.body)
            
            const pt = p.total
            console.log(pt)
            if(pt<=0){
              res.send("You have nothing in cart")  
            }else{

            
           
          const session = await  stripe.checkout.sessions.create({
            
            line_items: [
                {
                    price_data: {
                        currency: 'INR',
                        unit_amount: pt * 100,
                        product_data: {
                            name: "Games",
                          },
                       
                    },
                    quantity: 1,
                },
              
              ],
              mode: 'payment',
            //   success_url: `${domain}/success.html`,
            //   cancel_url: `${domain}/cancel.html`,
            success_url:`http://localhost:3000/suc` ,
             cancel_url: `http://localhost:3000/fail`,
            });


            res.redirect(303, session.url)
                   
        }  

    })

    app.listen(3000);
