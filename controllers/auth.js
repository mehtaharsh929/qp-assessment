const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');


const Joi = require('joi');

// Joi schema for user registration
const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const registerUser = async (req, res) => {
    try {
        // Validate the request body
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const { name, email, password } = req.body;
        // Check if the email exists
        const userExists = await db.User.findOne({
            where: { email }
        });
        if (userExists) {
            return res.status(400).send('Email is already associated with an account');
        }

        await db.User.create({
            name,
            email,
            password: await bcrypt.hash(password, 15),
        });

        return res.status(200).send('Registration successful');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error in registering user');
    }
};

// Joi schema for user login
const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const signInUser = async (req, res) => {
    try {
        // Validate the request body
        const { error } = signInSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const { email, password } = req.body;

        // Check if the user exists
        const user = await db.User.findOne({
            where: { email }
        });

        // If the user doesn't exist, return an error
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        // Check if the provided password matches the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If the passwords don't match, return an error
        if (!passwordMatch) {
            return res.status(401).send('Invalid credentials');
        }

        const jwtToken = jwt.sign(
            { userId: user.id, email: user.email ,role:user.role},
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Send the token in the response
        return res.status(200).json({ token: jwtToken, message: 'Login successful' });

    } catch (err) {
        console.error(err);
        return res.status(500).send('Error in signing in');
    }
};


module.exports = {
    registerUser,
    signInUser
}
