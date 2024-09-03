

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


// register

const registerUser = async(req, res) => {
    const {userName, email, password} = req.body

    try{

        const checkUser = await User.findOne({email})
        if(checkUser) return res.json({success : false, message : "User already exists with this email "});

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName,
            email,
            password : hashPassword,
        })

        await newUser.save()
        res.status(200).json(
            {
                success : true,
                message : "User created successfully",
            }
        )

    }catch(e){
        console.log(e)
        res.status(500).json(
            {
                success : false,
                message : "Some error occured",
            }
        );
    }
}



// login
const loginUser = async(req, res) => {
    
    const {email, password} = req.body;

    try{
    
        const checkUser = await User.findOne({email})
        if(!checkUser) return res.json({
            success : false, 
            message : "User does not exist with this email "
        });

        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password)
        if(!checkPasswordMatch) return res.json({
            success : false, 
            message : "Incorrect password"
        });

        const token = jwt.sign({
            id : checkUser._id, role : checkUser.role, email : checkUser.email
        }, 'CLIENT_SECRET_KEY', {expiresIn : '60m'})

        res.cookie('token', token, {
            httpOnly : true,
            secure : false,

        }).json({
            success : true,
            message : "Logged in successfully",
            user : {
                email : checkUser.email,
                role : checkUser.role,
                id : checkUser.id
            }
        })


    }catch(e){
        console.log(e)
        res.status(500).json(
            {
                success : false,
                message : "Some error occured",
            }
        );
    }
}


// logout


const logout = (req, res) => {
    res.clearCookie('token').json({
        success : true,
        message : "Logged out successfully"
    })
}


//auth middleware


module.exports = { registerUser, loginUser, logout }