import express from 'express';
import {PrismaClient} from "@prisma/client";
import cors from 'cors'; 
import bcrypt from "bcrypt";
import { verifyUser } from './middleware/register.middleware.js';
import validateEmailUsername from './middleware/details.middleware.js';
import checkStrongPassword from './middleware/checkpassword.strength.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';



const app = express();
app.use(cors({
  origin:'http://localhost:5173',
  methods:['POST','GET','PUT','PATCH','DELETE'],
  credentials:true
}));
app.use(cookieParser());

const client = new PrismaClient();
app.use(express.json());

app.post('/auth/register', [verifyUser,validateEmailUsername,checkStrongPassword],async (req, res) => {
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

app.post('/auth/login', async (req, res) => {
  const {identifier, password} =req.body;  
  try {
     const user=await client.user.findFirst({
      where: {
        OR: [
          { emailAddress:identifier },
          { userName:identifier }
        ]
      }    
    })    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = {
      userId: user.id,
      emailAddress: user.emailAddress,
      userName:user.userName,
      firstName:user.firstName,
      lastName:user.lastName,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      
    });
    res.status(200).cookie("jwtToken",token,{}).json({
      message: 'Login successful',
     firstName:user.firstName,
     lastName:user.lastName,
     emailAddress: user.emailAddress,
     userName: user.userName
    });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});










app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
