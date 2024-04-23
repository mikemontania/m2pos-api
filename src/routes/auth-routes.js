const {Router} = require('express'); 
const { check } = require('express-validator');
const router = Router();
const {login, renewToken, updatePassword} = require('../controllers/auth-controller.js'); 
const { validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');

router.post('/login',[
    check('username','El username es obligatorio').isEmail(),
    check('password','El password es obligatorio').not().isEmpty(),
    validarCampos
],login);
router.put('/reset',[
    check('username','El username es obligatorio').isEmail(),
    check('password','El password es obligatorio').not().isEmpty(),
    validarCampos
],updatePassword);

router.get( '/renew',
    validarJWT,  auditMiddleware,
    renewToken
)
module.exports =router;