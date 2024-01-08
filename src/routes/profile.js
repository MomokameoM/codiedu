const express = require('express');
const router = express.Router();

const pooldb = require('../database');
const {isLoggedIn} = require('../lib/auth');

//editar perfil
router.get('/edit/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const users = await pooldb.query('select * from users where id =?',[id]);
    res.render('profile/edit', {users: users[0]})
});
router.post('/edit/:id',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {username,fullname,imagen,email} = req.body;
    const verifiUser = await pooldb.query('select * from users where username = ? and id != ?',[username,id]);
    const verifiEmail = await pooldb.query('select * from users where email = ? and id != ?',[email, id]);
    console.log("se verifico ",verifiUser, verifiEmail)
    if (username===""||fullname===""||imagen===""||email===""){
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/profile/edit/'+id);
    }else  if (verifiUser.length>0){
        req.flash('message', 'Ese nombre de usuario ya esta registrado');
        res.redirect('/profile/edit/'+id);
    }else  if (verifiEmail.length>0){
        req.flash('message', 'Ese correo ya esta registrado');
        res.redirect('/profile/edit/'+id);
    }
    else {
        const newLink = {
            username, fullname, imagen,email
        };
        await pooldb.query('update users set ? where id=?', [newLink, id]);
        req.flash('success', 'Perfil editado correctamente');
        res.redirect('/profile');
    }
});

router.get('/profile', isLoggedIn,(req,res)=>{
    const {id} = req.params;
    console.log("ESTE ES EL IDSSSSS",[id]);
    res.render('profile');
});

module.exports = router;