const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const { response } = require("express");
const { generarJWT } = require("../helpers/jwt-helper");
const Usuario = require("../models/usuario.model");

const updatePassword = async (req, res = response) => {
  try {
    const { username, password } = req.body;
    let user = await Usuario.findOne({ where: { username: username } });
    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }
    // Encrypt password
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);
    user.password = hashedPassword;

    // Restablecer los intentos fallidos al actualizar la contraseña
    user.intentos = 0;
    user.bloqueado = false;

    await user.save();

    res.status(200).json({
      ok: true,
      user: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar la contraseña" });
  }
};

const login = async (req, res = response) => {
  console.log(req.body);
  const { username, password } = req.body;
  console.log("***************");
  try {
    const userDB = await Usuario.findOne({
      where: {
        username: username,
        activo: true
      }
    });

    if (!userDB) {
      return res.status(404).json({
        error: "Credenciales incorrectas"
      });
    }
    console.log(userDB);

    // Verificar si el usuario está bloqueado
    if (userDB.bloqueado) {
      console.log("Usuario bloqueado. Se han realizado varios intentos");
      return res.status(401).json({
        ok: false,
        error: "Usuario bloqueado. Se han realizado varios intentos"
      });
    }
    const validPassword = await bcryptjs.compare(password, userDB.password);

    if (!validPassword) {
      // Incrementar los intentos fallidos
      userDB.intentos += 1;
      if (userDB.intentos >= 3) userDB.bloqueado = true;
      await userDB.save();

      console.log("Contraseña o usuario no valido");
      return res.status(400).json({
        ok: false,
        error: "Contraseña o usuario no valido"
      });
    }
    userDB.intentos = 0;
    await userDB.save();
    const token = await generarJWT(userDB.id);

    res.json({
      ok: true,
      token: token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al iniciar session"
    });
  }
};

const renewToken = async (req, res = response) => {
  try {
    const tokenReq = req.headers.authorization.split(" ")[1];
    console.log(tokenReq);
    const { user } = jsonwebtoken.verify(tokenReq, process.env.JWT_SECRET);

    const tokenNew = await generarJWT(user.id);

    res.status(200).json({
      ok: true,
      token: tokenNew
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal error, check log"
    });
  }
};

module.exports = {
  login,
  renewToken,
  updatePassword
};
