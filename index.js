import express from 'express';
import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";
import { verifyUser } from './middleware/register.middleware.js';


const app = express();

const client = new PrismaClient();
app.use(express.json());

app.post('/auth/register', verifyUser,async (req, res) => {
    const {firstName,lastName, emailAddress,userName,password}= req.body 
    const hashedPassword = await bcrypt.hash(password, 12); 

    try {
      
      const createdUser = await client.user.create({
        data:{
          firstName,
          lastName,
          emailAddress,
          userName,
          password:hashedPassword,
        }
      })
      res.status(201).json({
        message: "User created successfully",
        status: "success",
        user: createdUser,
      })      
    } catch (error) {

      res.status(500).json({
        message:"Error creating the user",

      })
      
    }

});










app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
