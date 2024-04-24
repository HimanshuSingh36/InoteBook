const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "HELLOWORLD"; //place it in a seprate log file don't expose it//

//path is localhost:4000/api/auth/createuser//

// Route1: Create a user using: POST "/api/auth/login". No login required//
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    //If there are errors return a bad request//
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      //Check user with same email exists//
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry user already exists" });
      }

      // res.send({ errors: result.array() });
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      // .then(user => res.json(user)).catch(err=>{console.log(err)
      //   res.json({error:err.message})});

      // res.send(req.body);
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);
      // res.json(user);
      res.cookie("authtoken",authToken);
      success=true;
      
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server eror");
    }
    
  }
);
//Route 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        sucess = false;
        return res.status(400).json({ sucess, error: "User don't exist" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        sucess = false;
        return res.status(400).json({ sucess, error: "User don't exist" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      sucess = true;
      res.json({ sucess, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
//Route 3: Get loggedin  user details using: POST "/api/auth/getuser". No login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
