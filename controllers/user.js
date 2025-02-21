const Users = require ("../model/user")
const AppError = require("../utils/AppError")
const mongoose = require("mongoose")


const getAllUsers = async (req, res, next) => {
    try {
        const Users = await require("../model/user");
        const allUsers = await Users.find();
        res.status(200).json({
            status: "success",
            message: "All users gotten successfully",
            result: allUsers.length,
            data: allUsers
        });
    } catch (error) {
        next(error);
    }
};

const getSingleUser = async (req, res, next) => {
    try{
        const id = req.params.id
        console.log(id)

        const user = await Users.findById(id)

        if(!user) {
            throw new AppError("User not found", 404)
        }

        res.status(200).json({
            status:"success",
            message:"user gotten successfuly",
            data:user,
        });
    } catch(error){
        next(error)
    }
};


const createNewUser = async (req, res, next) => {
    try {
        console.log('Incoming request body:', req.body); // Log the request body for debugging
        const { firstName, lastName, email, password } = req.body;

        // Validate fields
        if (!firstName || !lastName || !email || !password) {
            throw new AppError("please fill in all fields", 400);
        }

        // Create a new user
        const newUser = await Users.create({
            firstName,
            lastName,
            email,
            password
        });

        res.status(201).json({
            status: "success",
            message: "User created successfully",
            data: newUser,
        });
    } catch (error) {
        next(error); // Pass other errors to the error handling middleware
    }
};

module.exports = {
    getAllUsers,
    getSingleUser,
    createNewUser
}