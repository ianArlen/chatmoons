const mongoose = require("mongoose");
const User = mongoose.model("User");
const sha256 = require("js-sha256");
const jwt = require("jwt-then");


const selectId = async (res, id) => {
  if (id === null){
      return res.status(400).json({
          error: 'Id vacio'
      })    
  }
  let jsonuser = null

  try {
      const query = {
          _id : {
              $eq:id
          } 
      }
      jsonuser = await user.findOne(query)
      
      if (jsonuser === null || jsonuser === undefined){
          return null 
      } 
      return jsonuser
      
  } catch (error) {

  }
};

const denyClientId = async (res) => {
  return res.status(400).json({
      error: 'Campo id no encontrado'
  })
};

const acceptClientId = (res, id) => {
  return res.status(200).json({
      id: id,
      success: true
  });
};


exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const emailRegex = /@yahoo.com|@hotmail.com|@live.com|@gmail.com/;

  if (!emailRegex.test(email)) throw "Email is not supported from your domain.";
  if (password.length < 6) throw "Password must be atleast 6 characters long.";

  const userExists = await User.findOne({
    email,
  });

  if (userExists) throw "User with same email already exits.";

  const user = new User({
    name,
    email,
    password: sha256(password + process.env.SALT),
  });

  await user.save();

  res.json({
    message: "User [" + name + "] registered successfully!",
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
    password: sha256(password + process.env.SALT),
  });

  if (!user) throw "Email and Password did not match.";

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.json({
    message: "User logged in successfully!",
    token,
  });
};
