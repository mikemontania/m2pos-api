const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { response } = require('express');
const { generarJWT } = require('../helpers/jwt-helper'); 
const Usuario = require('../models/usuario.model');

const updatePassword = async (req, res = response) => {
    try {
        const { username, password } = req.body;
        let user = await Usuario.findOne({ where: { username: username } });
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'User does not exist'
            });
        } 
        // Encrypt password
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(password, salt);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            ok: true,
            user: user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal error, check log'
        });
    }
};

const login = async (req, res = response) => {
    console.log(req.body)
    const { username, password } = req.body;
    console.log('***************')
    try {
        const userDB = await Usuario.findOne({
            where: {
                username: username,
                activo: true
            }
        });

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User does not exist'
            });
        }
        console.log(userDB)
        const validPassword = await bcryptjs.compare(password, userDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid password'
            });
        }

        const token = await generarJWT(userDB.id);

        res.json({
            ok: true,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal error, check log'
        });
    }
};

const renewToken = async (req, res = response) => {
    try {
        const tokenReq = req.headers.authorization.split(" ")[1];
        console.log(tokenReq)
        const { user } = jsonwebtoken.verify(tokenReq, process.env.JWT_SECRET);

        const tokenNew = await generarJWT(user.id);

        res.status(200).json({
            ok: true,
            token: tokenNew
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal error, check log'
        });
    }
};

module.exports = {
    login,
    renewToken,
    updatePassword
};
