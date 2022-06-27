import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

mongoose.connect('mongodb+srv://qBBma6VU2r9Ztf0y:Wz45AhfercA8Kw0T@cluster0.32wundr.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log('DB connected.');
})
    .catch((err) => {
        console.log('DB error: ', err);
    })

const app = express();

app.use(express.json());

app.post('/auth/register', (req, res) => {

    

})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server is running.')
})
