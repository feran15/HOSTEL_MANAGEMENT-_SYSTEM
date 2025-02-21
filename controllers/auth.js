const Users = require("./../model/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/AppError");

const register = async (req, res, next) => {
  try {
    const { email, firstname, lastname, password } = req.body;

    if (!email || !firstname || !lastname || !password) {
      throw new AppError("Please fill in all required fields", 400);
    }

    // Check if user with the email exists
    const existingUser = await Users.findOne({ email: email });

    if (existingUser) {
      throw new AppError("User with the email address exists", 400);
    }

    // Hash the user password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(password, hashedPassword);

    const newUser = await Users.create({
      email,
      firstname,
      lastname,
      password: hashedPassword,
    });

    // Generate jwt token
    const jwtSecret = process.env.jwtSecret;
    jwtExpiresIn = process.env.jwtExpiresIn;
    const token = jwt.sign({ id: newUser._id }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
    // Send response
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // Get user credentials
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Please provide email and password", 400);
    }
    // Check if the user exists and the password is correct

    const user = await Users.findOne({ email: email }, "+password");
    console.log(user);

    let checkIfPasswordIscorrect = false;
    if (user) {
      checkIfPasswordIscorrect = await bcrypt.compare(password, user?.password);
    }
    console.log(checkIfPasswordIscorrect);

    if (!user || !checkIfPasswordIscorrect) {
      throw new AppError("Invalid email or password", 400);
    }

    // Generate jwt token
    const jwtSecret = process.env.jwtSecret;
    jwtExpiresIn = process.env.jwtExpiresIn;
    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
    console.log(token);

    // Send response
    res.status(201).json({
      status: "success",
      message: "Login Successfull",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  register,
  login 
};