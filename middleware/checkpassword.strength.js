 import zxcvbn from "zxcvbn";

async function checkStrongPassword(req,res,next){

    const {password}= req.body;
    const passwordStrength = zxcvbn(password);

    if(passwordStrength.score < 3){
        return res.status(400).json({
           message: "Please use a strong password",
        })
    }
    next();
}
export default checkStrongPassword;