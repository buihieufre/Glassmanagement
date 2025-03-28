const User = require('../models/userModal')
const jwtHelper = require('../helpers/jwt')
const {hashPassword, comparePassword} = require('../services/passwordServices')
exports.signup = async (req, res) => {
    const {name, email, password} = req.body
    console.log(req.body)
    const user = await User.count({  where: {email: email}})

    if(user > 0){
        return res.status(400).json({message: 'Email already exists'})
    }

    const passwordHash = (await hashPassword(password)).toString()
    
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    })
    return res.status(201).json({message: 'User created successfully', data: newUser})
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const count = await User.count({ where: { email: email } });
    if (count === 0) {
        return res.status(400).json({ message: "Email does not exist on system" });
    }
    const user = await User.findOne({ where: { email: email } });
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Password is incorrect" });
    }
    const accessToken = jwtHelper.generateAccessToken({
        userId: user.id,
        username: user.username,
    });
    const refreshToken = jwtHelper.generateRefreshToken({
        userId: user.id,
        username: user.username,
    });

    user.update({ status: "active" });

    return res.status(200).json({
        accessToken,
        refreshToken,
        userInfo: {
            ...user.dataValues,
            password: undefined,
            status: undefined,
            role: undefined,
            createdAt: undefined,
            updatedAt: undefined,
        },
    });
};

exports.logout = async (req, res) => {
    try {
        const userId = req.id;
        User.update({ status: "inactive" }, { where: { id: userId } });
        return res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};