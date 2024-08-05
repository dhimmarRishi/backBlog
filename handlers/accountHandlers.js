const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");

const generateToken = (id) => {
  return jwt.sign({id}, "Rishi@123")
}

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) return res.json({ msg: "Empty Field Detected" });

    const tempUser = await userModel.findOne({ email });
    if (!tempUser) return res.json({ msg: "No User with such email detected" });

    const validPass = await bcrypt.compare(password, tempUser.password);
    if (!validPass) return res.json({ msg: "Wrong Password" });

    const token =  generateToken(tempUser._id);

    console.log(tempUser);
    return res.json({
      msg: "Valid User",
      id: tempUser._id,
      fname: tempUser.fname,
      lname: tempUser.lname,
      password: tempUser.password,
      token : token
    });
  } catch (e) {
    console.log("Error in login : " + e);
    res.json({ msg: "Error " + e });
  }
};

const handleRegister = async (req, res) => {
  try {
    const { fname, lname, email } = req.body;
    const tempPass = req.body.password;

    console.log(req.body);
    // console.log(fname,lname,email,tempPass)

    if (!fname || !email || !tempPass)
      return res.json({ msg: "Empty Fields Detected" });

    const hashPass = bcrypt.hashSync(tempPass, 10);

    const tempUser = new userModel({
      fname,
      lname,
      email,
      password: hashPass,
    });
    await tempUser.save();
    console.log("Successful Account Creation");
    return res.json({ msg: "register" });
  } catch (e) {
    console.log("Error in account creation : " + e);
    return res.json({ msg: "Error " + e });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const { id } = req;
    console.log(id)
    const user = await userModel.findById(id).lean(); // Using lean() for lightweight object
    user.password = ''
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
};

module.exports = {
  handleLogin,
  handleRegister,
  getUserInfo
};
