const express = require('express');
const router = express.Router();
const pooldb = require('../database');
const passport= require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const nodemailer = require("nodemailer");
const helpers = require('../lib/helpers');
const poolDB = require("../database");
const {Result} = require("express-validator");

router.get('/terminos',isNotLoggedIn, (req,res)=>{
    res.render('auth/terminos');
});

router.get('/politicas',isNotLoggedIn, (req,res)=>{
    res.render('auth/politicas');
});


// registro Docente
router.get('/signup',isLoggedIn, (req,res)=>{
    res.render('auth/signup');
});

router.post('/signup',isLoggedIn, passport.authenticate('local.signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

//login

router.get('/signin',isNotLoggedIn, (req,res)=>{
    res.render('auth/signin');
});
router.post('/signin',isNotLoggedIn,(req,res,next)=>{
    passport.authenticate('local.signin',{
       successRedirect: '/profile',
       failureRedirect: '/signin',
        failureFlash: true
    })(req,res,next);
    
});

// registro Estudiante
router.get('/signupE',isNotLoggedIn, (req,res)=>{
    res.render('auth/signupE');
});

router.post('/signupE',isNotLoggedIn, passport.authenticate('local.signupE',{
    successRedirect: '/profile',
    failureRedirect: '/signupE',
    failureFlash: true
}));

//perfil
router.get('/profile', isLoggedIn,async (req, res) => {
    const id = req.user.id;
    const permisos = req.user.permisos;
    const permisosAdmin = req.user.permisosAdmin;
    const lastaccess = await pooldb.query('select lastaccess from users where id=?',[id]);
    console.log("last aces", lastaccess)
    if (permisos){
        const rimasN = await pooldb.query('SELECT cr.rimas_id,r.createdat,c.title,count(c.user_id) as numCount FROM cursosRimas AS cr INNER JOIN respuestas AS r ON r.fk_id_rimas = cr.rimas_id INNER JOIN cursos as c on c.id=cr.cursos_id where c.user_id=? and r.createdat > ?',[id,lastaccess[0].lastaccess]);
        const oracionesN = await pooldb.query('SELECT co.oraciones_id,o.createdat,c.title,count(c.user_id) as numCount FROM cursosOraciones AS co INNER JOIN respuestasO AS o ON o.fk_id_oraciones = co.oraciones_id INNER JOIN cursos as c on c.id=co.cursos_id where c.user_id=? and o.createdat > ?',[id,lastaccess[0].lastaccess]);
        const signosN = await pooldb.query('SELECT co.signos_id,o.createdat,c.title,count(c.user_id) as numCount FROM cursosSignos AS co INNER JOIN respuestasS AS o ON o.fk_id_signos = co.signos_id INNER JOIN cursos as c on c.id=co.cursos_id where c.user_id=? and o.createdat > ?',[id,lastaccess[0].lastaccess]);
        const unirN = await pooldb.query('SELECT co.unir_id,o.createdat,c.title,count(c.user_id) as numCount FROM cursosUnir AS co INNER JOIN respuestasU AS o ON o.fk_id_unir = co.unir_id INNER JOIN cursos as c on c.id=co.cursos_id where c.user_id=? and o.createdat > ?',[id,lastaccess[0].lastaccess]);
        const alumnos = await pooldb.query('select u.username,ca.cursos_id,c.user_id from cursosAlumnos as ca inner join users as u on ca.users_id = u.id inner join cursos as c on c.id= ca.cursos_id where c.user_id=? and ca.createdat > ?;',[id,lastaccess[0].lastaccess]);
        const alumnosCount = await pooldb.query('select u.username,ca.cursos_id,count(c.user_id) as countRows from cursosAlumnos as ca inner join users as u on ca.users_id = u.id inner join cursos as c on c.id= ca.cursos_id where c.user_id=? and ca.createdat > ?;',[id,lastaccess[0].lastaccess]);
        console.log(rimasN[0].numCount);
        console.log("Ora",alumnos);
        console.log("Or22a",alumnosCount[0].countRows);
        const rimasNum= rimasN[0].numCount;
        const oracionesNum= oracionesN[0].numCount;
        const signosNum= signosN[0].numCount;
        const unirNum= unirN[0].numCount;
        let alumnosNum = [];
        if (alumnos===undefined||alumnos===""||alumnos===null||alumnos.length<=0){
             alumnosNum="Ninguno"
        }else{
            for (let i = 0; i < alumnosCount[0].countRows; i++) {
                alumnosNum[i]=alumnos[i].username;
                console.log("Nombre ", alumnos[i].username)
            }
        }
        res.render('profile', {rimasNum,oracionesNum,signosNum,unirNum,alumnosNum});
    }else {
        if (permisosAdmin){
            const rimasN = await pooldb.query('SELECT cr.rimas_id,r.createdat,c.title,count(c.user_id) as numCount FROM cursosRimas AS cr INNER JOIN respuestas AS r ON r.fk_id_rimas = cr.rimas_id INNER JOIN cursos as c on c.id=cr.cursos_id where r.createdat > ?',[lastaccess[0].lastaccess]);
            const oracionesN = await pooldb.query('SELECT co.oraciones_id,o.createdat,c.title,count(c.user_id) as numCount FROM cursosOraciones AS co INNER JOIN respuestasO AS o ON o.fk_id_oraciones = co.oraciones_id INNER JOIN cursos as c on c.id=co.cursos_id where o.createdat > ?',[lastaccess[0].lastaccess]);
            const signosN = await pooldb.query('SELECT co.signos_id,o.createdat,c.title,count(c.user_id) as numCount FROM cursosSignos AS co INNER JOIN respuestasS AS o ON o.fk_id_signos = co.signos_id INNER JOIN cursos as c on c.id=co.cursos_id where  o.createdat > ?',[lastaccess[0].lastaccess]);
            const unirN = await pooldb.query('SELECT co.unir_id,o.createdat,c.title,count(c.user_id) as numCount FROM cursosUnir AS co INNER JOIN respuestasU AS o ON o.fk_id_unir = co.unir_id INNER JOIN cursos as c on c.id=co.cursos_id where o.createdat > ?',[lastaccess[0].lastaccess]);
            const alumnos = await pooldb.query('select u.username,ca.cursos_id,c.user_id from cursosAlumnos as ca inner join users as u on ca.users_id = u.id inner join cursos as c on c.id= ca.cursos_id where ca.createdat > ?;',[lastaccess[0].lastaccess]);
            const alumnosCount = await pooldb.query('select u.username,ca.cursos_id,count(c.user_id) as countRows from cursosAlumnos as ca inner join users as u on ca.users_id = u.id inner join cursos as c on c.id= ca.cursos_id where ca.createdat > ?;',[lastaccess[0].lastaccess]);
            console.log(rimasN[0].numCount);
            console.log("Ora",alumnos);
            console.log("Or22a",alumnosCount[0].countRows);
            const rimasNum= rimasN[0].numCount;
            const oracionesNum= oracionesN[0].numCount;
            const signosNum= signosN[0].numCount;
            const unirNum= unirN[0].numCount;
            let alumnosNum = [];
            if (alumnos===undefined||alumnos===""||alumnos===null||alumnos.length<=0){
                alumnosNum="Ninguno"
            }else{
                for (let i = 0; i < alumnosCount[0].countRows; i++) {
                    alumnosNum[i]=alumnos[i].username;
                    console.log("Nombre ", alumnos[i].username)
                }
            }
            res.render('profile', {rimasNum,oracionesNum,signosNum,unirNum,alumnosNum});
        }else {
            const user = await pooldb.query('select u.*,ca.cursos_id from cursosAlumnos as ca inner join users as u on ca.users_id = u.id where u.id=?;', [id]);
            const ni = await pooldb.query('SELECT COUNT(*) as numCount FROM cursosAlumnos where users_id=?;', [id]);
            if (ni === 0){
                res.render('profile');
            }else {
                console.log("ni es "+ni[0].numCount);
                const array = [];
                const arrayR = [];
                const arrayO = [];
                const arrayS = [];
                const arrayU = [];
                for (let i = 0; i < ni[0].numCount ; i++) {
                    const curso_i = user[i].cursos_id;
                    console.log("el id cursos es"+ curso_i)
                    const edu = await pooldb.query('select e.*,ce.cursos_id from edu as e inner join cursosEdu as ce on e.id=ce.edu_id where createdat > ? and cursos_id=?',[lastaccess[0].lastaccess,curso_i]);
                    console.log("edu es",edu);
                    if (edu === undefined|| edu===null||edu.length<=0||edu===""){
                        array[i]="Nada";
                    }else {
                        array[i]=edu[0].title;
                    }
                    //console.log("El array ["+i+"] es " , array[i]);
                    //console.log(curso_i)
                }
                for (let i = 0; i < ni[0].numCount ; i++) {
                    const curso_r = user[i].cursos_id;
                    console.log("el id cursos rimas es"+ curso_r)
                    const rimas = await pooldb.query('select c.title,cr.cursos_id from cursos as c inner join cursosRimas as cr on c.id=cr.cursos_id where createdat > ? and cursos_id=?',[lastaccess[0].lastaccess,curso_r]);
                    console.log("rimas es",rimas);
                    if (rimas === undefined|| rimas===null||rimas.length<=0||rimas===""){
                        arrayR[i]="Nada";
                    }else {
                        arrayR[i]=rimas[0].title;
                    }
                    console.log("El array ["+i+"] es " , arrayR[i]);
                    //console.log(curso_i)
                }
                for (let i = 0; i < ni[0].numCount ; i++) {
                    const curso_r = user[i].cursos_id;
                    console.log("el id cursos oraciones es"+ curso_r)
                    const oraciones = await pooldb.query('select c.title,cr.cursos_id from cursos as c inner join cursosOraciones as cr on c.id=cr.cursos_id where createdat > ? and cursos_id=?',[lastaccess[0].lastaccess,curso_r]);
                    console.log("oraciones es",oraciones);
                    if (oraciones === undefined|| oraciones===null||oraciones.length<=0||oraciones===""){
                        arrayO[i]="Nada";
                    }else {
                        arrayO[i]=oraciones[0].title;
                    }
                    console.log("El array ["+i+"] es " , arrayO[i]);
                    //console.log(curso_i)
                }
                for (let i = 0; i < ni[0].numCount ; i++) {
                    const curso_r = user[i].cursos_id;
                    console.log("el id cursos signos es"+ curso_r)
                    const signos = await pooldb.query('select c.title,cr.cursos_id from cursos as c inner join cursosSignos as cr on c.id=cr.cursos_id where createdat > ? and cursos_id=?',[lastaccess[0].lastaccess,curso_r]);
                    console.log("signos es",signos);
                    if (signos === undefined|| signos===null||signos.length<=0||signos===""){
                        arrayS[i]="Nada";
                    }else {
                        arrayS[i]=signos[0].title;
                    }
                    console.log("El array ["+i+"] es " , arrayS[i]);
                    //console.log(curso_i)
                }
                for (let i = 0; i < ni[0].numCount ; i++) {
                    const curso_r = user[i].cursos_id;
                    console.log("el id cursos unir es"+ curso_r)
                    const unir = await pooldb.query('select c.title,cr.cursos_id from cursos as c inner join cursosUnir as cr on c.id=cr.cursos_id where createdat > ? and cursos_id=?',[lastaccess[0].lastaccess,curso_r]);
                    console.log("unir es",unir);
                    if (unir === undefined|| unir===null||unir.length<=0||unir===""){
                        arrayU[i]="Nada";
                    }else {
                        arrayU[i]=unir[0].title;
                    }
                    console.log("El array ["+i+"] es " , arrayU[i]);
                    //console.log(curso_i)
                }
                const newArrayEdu = array.filter((item) => item !== "Nada");
                console.log("El newarray es ",newArrayEdu);
                const newArrayRimas = arrayR.filter((item) => item !== "Nada");
                console.log("El newarray Rimas ",newArrayRimas);
                const newArrayOra = arrayO.filter((item) => item !== "Nada");
                console.log("El newarray Oraciones ",newArrayOra);
                const newArraySignos = arrayS.filter((item) => item !== "Nada");
                console.log("El newarray signos ",newArraySignos);
                const newArrayUnir = arrayU.filter((item) => item !== "Nada");
                console.log("El newarray unir ",newArrayUnir);
                //console.log("Test    ssssssssss",array[0].edu[0].url)
                res.render('profile',{newArrayEdu,newArrayRimas,newArrayOra,newArraySignos,newArrayUnir});
            }
        }
    }
   
});
//home
router.get('/home', isLoggedIn,(req,res)=>{
    res.render('home');
    
});

//home Cliente
router.get('/homeC', isLoggedIn,(req,res)=>{
    res.render('homeC', { layout: 'client' });

});

//nosotros
router.get('/nosotros',(req,res)=>{
    res.render('nosotros');
});

//logout
router.get('/logout',isLoggedIn,async (req, res) => {
    await poolDB.query('UPDATE users SET lastaccess = current_timestamp where id = ?', [req.user.id]);
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})




//vista recuperar contra
router.get('/forgot',isNotLoggedIn, (req,res)=>{
    res.render('auth/forgot');
});
// enviar email
router.post('/send-email',isNotLoggedIn, async (req, res)=> {
    const {email} = req.body;
    const forgotPassword = await pooldb.query('select * from users where email =?',[email]);
    if (email === ""){
        req.flash('message', 'Inserte un correo');
        }
    else {
        if (forgotPassword.length<1){
            req.flash('message', 'El correo no esta registrado');
        }else {
            const existToken = await pooldb.query('SELECT u.id, u.email, t.user_id FROM users AS u INNER JOIN passToken AS t ON u.id = user_id WHERE u.id =?;',[forgotPassword[0].id]);
            if (existToken.length > 0) {
                req.flash('message', 'Ya se envio un correo de recuperacion a ese correo.');
            } else {
                    let token = helpers.randomToken(6);
                    console.log("EL TOKEN ES ", token);
                    await pooldb.query("INSERT INTO passToken (token,expires, user_id) VALUES (?,NOW() + INTERVAL 10 MINUTE,?)",[token,forgotPassword[0].id]);/* 
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: 'codyedu.team@gmail.com', // generated ethereal user
                            pass: 'uxclhxehinehfmtw', // generated ethereal password
                        },
                    });
                    var mailOptions = {
                        from: "CodyEdu", // sender address
                        to: email, // list of receivers
                        subject: "Recuperacion de contraseña", // Subject line
                        text: "Este es un correo de recuperacion de contraseña, entre al siguiente enlace para restablecerla: https://codiedu.herokuapp.com/forgot/"+ token, //https://codiedu.herokuapp.com/forgot/ para heroku http://localhost:3000/forgot/ para local
                    };
                    transporter.sendMail(mailOptions,(error, info)=>{
                        if (error)
                            res.status(500).send(error.message);
                        else
                            console.log("Enviado correctamente");
                    });
                   
                    
               */     
            }
            req.flash('success', 'Correo enviado');
        }
    }
    res.redirect('/forgot');
});

//restablecer contraseña
router.get('/forgot/:token',isNotLoggedIn, async (req,res)=>{
    const {token} = req.params;
    const idUser = await pooldb.query('select * from passToken where token =?',[token]);
    console.log("CON ELTOKEN ESTAMOS CONSIGUIENDO:" , idUser );
    if (idUser.length < 1){
        req.flash('message', 'El token ya caduco');
        res.redirect('/forgot');
    }
    else{
        const pass = await pooldb.query('select * from users where id =?',[idUser[0].user_id]);
        res.render('auth/forgot',{pass: pass[0]});
    }
});

router.post('/forgot/:id',isNotLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const { password } = req.body;
    const hashedPassword = await helpers.encryptPassword(password);
    await pooldb.query("DELETE FROM passToken WHERE user_id=?",[id]);
    await pooldb.query('update users set password = ? where id=?', [hashedPassword, id]);
    req.flash('success', 'Contraseña actualizada correctamente');
    res.redirect('/signin');
});

//qujas
router.get('/quejas', isLoggedIn,(req,res)=>{
    res.render('quejas');
});

// enviar email
router.post('/send-email2',isLoggedIn, async (req, res)=> {
    const id = req.user.id
    const {categoria}= req.body;
    const {text}= req.body;
    if(text===""){
        req.flash('message', 'Por favor escriba su mensaje');
        res.redirect('/quejas');
    }
    else {
        let consulta = await pooldb.query("select * FROM users WHERE id=?",[id]);
        const user_email = consulta[0].email;
        const user_name = consulta[0].username;
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'codyedu.team@gmail.com', // generated ethereal user
                pass: 'uxclhxehinehfmtw', // generated ethereal password
            },
        });
        var mailOptions = {
            from: user_email, // sender address
            to: "codyedu.team@gmail.com", // list of receivers
            subject: categoria+" del usuario "+user_name, // Subject line
            text: "Usuario: "+user_name+"\nCorreo: "+user_email+"\nEl maensaje es: \n"+text
        };
        transporter.sendMail(mailOptions,(error, info)=>{
            if (error)
                res.status(500).send(error.message);
            else
                console.log("Enviado correctamente");
        });
        req.flash('success', 'Correo enviado');
        res.redirect('/profile');
    }
});


module.exports = router;