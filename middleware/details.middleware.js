
import {PrismaClient} from "@prisma/client"

const client = new PrismaClient();
export default async function validateEmailUsername(req, res, next) {
    const { emailAddress, userName } = req.body;
    try {
        
        const existingEmail = await client.user.findFirst({
            where: {
                emailAddress: emailAddress,
            },
            
        });
        if (existingEmail) {
            return res.status(400).json({
                message: "Email already exists",
                
            });
        }
        const existingUserName = await client.user.findFirst({
            where: {
                userName: userName,
            },
            
        });
        if (existingUserName) {
            return res.status(400).json({
                message: "Username already exists",
            
            });
        }
        next();
       
    }catch (error) {
        return res.status(500).json({
            message: "Error checking for existing email or username",
            status: "fail",
        });
    }

}