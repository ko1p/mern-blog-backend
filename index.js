import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import { validationResult } from 'express-validator';

import { registerValidation } from './validations/validations.js';

import UserModel from './models/User.js';


mongoose.connect('mongodb+srv://qBBma6VU2r9Ztf0y:Wz45AhfercA8Kw0T@cluster0.32wundr.mongodb.net/blog?retryWrites=true&w=majority').then(() => {
    console.log('DB connected.');
})
    .catch((err) => {
        console.log('DB error: ', err);
    })

const app = express();

app.use(express.json());

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
    
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })
    
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 'secret123', {
            expiresIn: '30d'
        })

        const { passwordHash, ...userData} = user._doc
    
        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться.',
        });
    }   
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server is running.')
})
