const User = require('../models/userModal')
const jwtHelper = require('../helpers/jwt')
const {hashPassword, comparePassword} = require('../services/passwordServices')
const { where } = require("sequelize");
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    const user = await User.count({ where: { email: email } });

    if (user > 0) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const passwordHash = (await hashPassword(password)).toString();

    const newUser = await User.create({
        name,
        email,
        password: passwordHash,
    });
    return res.status(201).json({ message: "User created successfully", data: newUser });
};

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

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email, role: "admin" } });
    let isMatch = false;
    if (!user) {
        return res.status(400).json({ message: "Incorrect email or password" });
    }
    isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Password is incorrect" });
    }
    const accessToken = jwtHelper.generateAccessToken({
        userId: user.id,
        username: user.username,
        role: user.role,
    });
    const refreshToken = jwtHelper.generateRefreshToken({
        userId: user.id,
        username: user.username,
        role: user.role,
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
        const { id } = req.body;
        User.update({ status: "inactive" }, { where: { id: id } });
        return res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getUserList = async (req, res) => {
    try {
        const user = await User.findAll();
        return res.status(200).json({
            data: user,
        });
    } catch (error) {
        return res.status(500);
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { role, id } = req.body;
        const user = await User.findOne({ where: { id: id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.update({ role: role }, { where: { id: id } });
        return res.status(200).json({ message: "Update successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updateUserInfo = async (req, res) => {
    try {
        const { phone, name, address, id } = req.body;
        const user = await User.update({ phone, address, name }, { where: { id: id } });
        return res.status(200).json({ message: "Update user info successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};