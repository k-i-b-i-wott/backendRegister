import express from 'express';
import {PrismaClient} from "@prisma/client";
import cors from 'cors'; 
import bcrypt from "bcrypt";
import { verifyUser } from './middleware/register.middleware.js';
import validateEmailUsername from './middleware/details.middleware.js';
import checkStrongPassword from './middleware/checkpassword.strength.js';



const app = express();
app.use(cors({
  origin:'http://localhost:5173',
  methods:['POST','GET','PUT','PATCH','DELETE'],
}));

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
  const { identifiers, password } = req.body;

  try {
    const loginUser= await client.user.findFirst({
      where:{
        OR:[
          { emailAddress: identifiers },
          { userName: identifiers }
        ]
      }
    })
    res.status(200).json({
      message: "User found",
      user: loginUser,
    })

  }catch (error) {
    res.status(500).json({
      message: "Error logging in",
    });
  }

}
);










app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
