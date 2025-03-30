
const userModel = require("../../model/userModel");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');


let login=async (req,res)=>{

    let loginDataCheckEmail=await userModel.findOne({userEmail:req.body.userEmail})
    console.log("loginDataCheckEmail", req.body);
    if(loginDataCheckEmail){
        let userDbPassword= loginDataCheckEmail.userPassword
      
                        //pradeep123
        let passwordCheck=bcrypt.compareSync(req.body.password, userDbPassword); // true
        if(passwordCheck){

            var token = jwt.sign({user:loginDataCheckEmail} , process.env.TOKENKEY);

            console.log(token);

            let resObj={
                status:1,
                mgs:"Login",
                token,
                loginDataCheckEmail
             }
             
                res.status('200').json(resObj)
        }
        else{
            let resObj={
                status:0,
                mgs:"Invalid Password",
                
             }
             res.status('200').json(resObj)
        }
    }
    else{
        let resObj={
                    status:0,
                    mgs:"Invalid Email",
                    
                 }
                 res.status('200').json(resObj)
    }
}




let register = async (req, res) => {
    let insertObj = req.body; //

    const salt = bcrypt.genSaltSync(saltRounds); //10
    const password = bcrypt.hashSync(req.body.userPassword, salt);

    insertObj['userPassword'] = password;

    try{
        let insertUser=new userModel(insertObj)
        let insertRes= await insertUser.save()
        let resObj={
            status:1,
            mgs:"User Created",
            insertRes
        }
        // OTPDATA.delete()
        res.send(resObj)
    }
    catch(error){
        let resObj={
            status:0,
            mgs:"Email Id Already Exist...",
            error
        }
        res.send(resObj)
    }


}






module.exports = { login, register }