const passport= require('passport');
const LocalStrategy = require('passport-local').Strategy;
const poolDB = require('../database')
const helpers = require('../lib/helpers');
const {use} = require("express/lib/router");

//login 
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body);
    const rows = await poolDB.query('select * from users where username = ?', [username]);
    await poolDB.query("DELETE FROM passToken WHERE expires < NOW()");
    //await poolDB.query('UPDATE users SET lastaccess = current_timestamp where username = ?',[username]);
        if (rows.length > 0) {
            const user = rows[0];
            const validPassword = await helpers.matchPassword(password, user.password)
            if (validPassword) {
                done(null, user, req.flash('success', 'Bienvenido ' + user.username));
            } else {
                done(null, false, req.flash('message', 'Contraseña incorrecta'));
            }
        } else {
            return done(null, false, req.flash('message', 'El usuario no existe'));
        }
}));

//registro Docente
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done)=>{
    console.log("SE LOGROOO");
    const { fullname } = req.body;
    const { email } = req.body;
    const permisos = Boolean(true);
    const permisosAdmin = Boolean(false);
    const newUser ={
        username,
        password,
        fullname,
        permisos,
        email,
        permisosAdmin
    };
    const verifiEmail = await poolDB.query('select * from users where email = ?', [email]);
    const verifiUser = await poolDB.query('select * from users where username = ?', [username]);
    if (email === "")
        return done(null, false, req.flash('message', 'Proporcione un correo.'));
    else if (fullname === "")
        return done(null, false, req.flash('message', 'Proporcione su nombre completo.'));
    else if (verifiEmail.length > 0)
        return done(null, false, req.flash('message', 'Ese correo ya esta registrado.'));
    else if (verifiUser.length > 0)
        return done(null, false, req.flash('message', 'Ese usuario ya esta registrado.'));
    else if (password.length < 6)
        return done(null, false, req.flash('message', 'La contraseña necesita ser de 6 caracteres minimo.'));
    else
        newUser.password = await helpers.encryptPassword(password);
    const result = await poolDB.query('insert into users set ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, false, req.flash('success', 'Docente registrado correctamente'));
}));

//registro Estudiante
passport.use('local.signupE', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done)=>{
    const { fullname } = req.body;
    const { email } = req.body;
    const { cbox } = req.body;
    const { cbox2 } = req.body;
    const { cbox3 } = req.body;
    const permisos = Boolean(false);
    const permisosAdmin = Boolean(false);
    const newUser ={
        username,
        password,
        fullname,
        permisos,
        email,
        permisosAdmin
    };
    const verifiEmail = await poolDB.query('select * from users where email = ?', [email]);
    const verifiUser = await poolDB.query('select * from users where username = ?', [username]);
    if (cbox === undefined){
        return done(null, false, req.flash('message', 'Tiene que aceptar los terminos y condiciones.'));   
    }
    if (cbox2 === undefined)
        return done(null, false, req.flash('message', 'Tiene que aceptar las politicas de privacidad.'));
    if (cbox3 === undefined)
        return done(null, false, req.flash('message', 'Tienes que verificar el captcha.'));
    else if (email === "")
        return done(null, false, req.flash('message', 'Proporcione un correo.'));
    else if (fullname === "")
        return done(null, false, req.flash('message', 'Proporcione su nombre completo.'));
    else if (verifiEmail.length > 0)
        return done(null, false, req.flash('message', 'Ese correo ya esta registrado.'));
    else if (verifiUser.length > 0)
        return done(null, false, req.flash('message', 'Ese usuario ya esta registrado.'));
    else if (password.length < 6)
        return done(null, false, req.flash('message', 'La contraseña necesita ser de 6 caracteres minimo.'));
    else
        newUser.password = await helpers.encryptPassword(password);
        const result = await poolDB.query('insert into users set ?', [newUser]);
        newUser.id = result.insertId;
        return done(null, newUser, req.flash('success', 'Se ha registrado correctamente, bienvenido ' + newUser.username));
}));

passport.serializeUser((user,done )=>{
     done(null, user.id);
});
passport.deserializeUser(async (id, done)=>{
    const rows = await poolDB.query('select * from users where id=?', [id]);
    done(null, rows[0]); 
});