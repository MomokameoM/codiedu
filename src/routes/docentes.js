const express = require('express');
const router = express.Router();
const pooldb = require('../database');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const passport = require("passport");

// mostrar docentes
router.get('/',isLoggedIn, async (req, res) => {
    const docentes = await pooldb.query('select * from users where permisos = 1');
    res.render('docentes/list', { docentes });
});

// mostrar estudiantes
router.get('/estudiantes',isLoggedIn, async (req, res) => {
    const estudiantes = await pooldb.query('select * from users where permisos = 0 and permisosAdmin=0');
    res.render('docentes/list', { estudiantes });
});

// añadir docente
router.get('/add',isLoggedIn, (req,res)=>{
    res.render('docentes/add');
});

router.post('/add',isLoggedIn, passport.authenticate('local.signup',{
    successRedirect: '/docentes',
    failureRedirect: '/docentes/add',
    failureFlash: true
}));


//eliminar docente
router.get('/delete/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    await pooldb.query('delete from users where id = ?', [id]);
    req.flash('success', 'Usuario eliminado correctamente');
    res.redirect('/docentes');
});
//editar docente
router.get('/edit/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const docentes = await pooldb.query('select * from users where id =?',[id]);
    if (docentes[0].permisos===1){
        const permisos =1;
        res.render('docentes/edit', {docentes: docentes[0],permisos });
    }else {
        if (docentes[0].permisosAdmin===1){
            const permisosAdmin =1;
            res.render('docentes/edit', {docentes: docentes[0],permisosAdmin });
        }
        else {
            res.render('docentes/edit', {docentes: docentes[0] });
        }
    }
    //const joinR = await pooldb.query('SELECT r.id,r.fk_id_usersE, u.fullname, r.fk_id_rimas ,rimas.title, r.intentos, r.score_rimas FROM users AS u INNER JOIN respuestas AS r ON u.id = r.fk_id_usersE INNER JOIN rimas AS rimas ON rimas.id = r.fk_id_rimas WHERE u.id = ?', [id]);
    //const joinO = await  pooldb.query('SELECT r.id, r.fk_id_usersE, u.fullname, r.fk_id_oraciones ,o.title, r.score_oraciones, r.intentos FROM users AS u INNER JOIN respuestasO AS r ON u.id = r.fk_id_usersE INNER JOIN oraciones AS o ON o.id = r.fk_id_oraciones WHERE u.id = ?', [id]);
});
router.post('/edit/:id',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const perm=await pooldb.query('select permisos from users where id=?',id);
    const {username,fullname,imagen,email,permisosList} = req.body;
    //console.log(permisosList)
    if (perm[0].permisos===0){
        if (permisosList === "Docente")
        {
            console.log("soy docente")
            const permisos = 1;
            const permisosAdmin = 0;
            const newLink = {
                username, fullname,imagen,email,permisos, permisosAdmin
            };
            await pooldb.query('update users set ? where id=?', [newLink, id]);
            req.flash('success', 'Estudiante editado correctamente');
            res.redirect('/docentes/estudiantes');
        }
        else if (permisosList === "Administrador")
        {
            console.log("soy admin")
            const permisosAdmin = 1;
            const permisos = 0;
            const newLink = {
                username, fullname,imagen,email,permisos, permisosAdmin
            };
            await pooldb.query('update users set ? where id=?', [newLink, id]);
            req.flash('success', 'Estudiante editado correctamente');
            res.redirect('/docentes/estudiantes');
        }
        else {
            console.log("soy estudiante")
            const permisosAdmin = 0;
            const permisos = 0;
            const newLink = {
                username, fullname,imagen,email,permisos, permisosAdmin
            };
            await pooldb.query('update users set ? where id=?', [newLink, id]);
            req.flash('success', 'Estudiante editado correctamente');
            res.redirect('/docentes/estudiantes');
        }
    }else{
        const {username,fullname,imagen,email,permisosList} = req.body;
        if (permisosList === "Docente")
        {
            const permisos = 1;
            const permisosAdmin = 0;
            const newLink = {
                username, fullname,imagen,email,permisos, permisosAdmin
            };
            await pooldb.query('update users set ? where id=?', [newLink, id]);
            req.flash('success', 'Docente editado correctamente');
            res.redirect('/docentes');
        }
        else if (permisosList === "Administrador")
        {
            const permisosAdmin = 1;
            const permisos = 0;
            const newLink = {
                username, fullname,imagen,email,permisos, permisosAdmin
            };
            await pooldb.query('update users set ? where id=?', [newLink, id]);
            req.flash('success', 'Docente editado correctamente');
            res.redirect('/docentes');
        }
        else {
            const permisosAdmin = 0;
            const permisos = 0;
            const newLink = {
                username, fullname,imagen,email,permisos, permisosAdmin
            };
            await pooldb.query('update users set ? where id=?', [newLink, id]);
            req.flash('success', 'Docente editado correctamente');
            res.redirect('/docentes');
        }
    }
});
module.exports = router;