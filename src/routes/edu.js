const express = require('express');
const router = express.Router();

const pooldb = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add/:id',isLoggedIn, (req, res)=>{
    const {id} = req.params;
    res.render('edu/add',{id:id});
});
// añadir contenido educativo
router.post('/add/:id',isLoggedIn, async (req, res)=>{
    const {id}=req.params;
    const { title, url, description } = req.body;
    if (title===""||url===""||description===""){
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/edu/add/'+id);
    }else {
        const newLink= {
            title,
            url,
            description,
            user_id: req.user.id
        }
        const consulta = await pooldb.query('insert into edu set ?', [newLink]);
        await pooldb.query('insert into cursosEdu(edu_id,cursos_id) values (?,?)', [consulta.insertId,id]);
        req.flash('success', 'Apoyo guardado correctamente');
        res.redirect('/cursos');
    }
});

router.get('/add2',isLoggedIn, (req, res)=>{
    res.render('edu/add2');
});
// añadir enlaces2
router.post('/add2',isLoggedIn, async (req, res)=>{
    const { title, url, description, imagen } = req.body;
    if (title===""||url===""||description===""||imagen===""){
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/edu/add2');
        }
    else {
        const newLink= {
            title,
            url,
            description,
            imagen,
            user_id: req.user.id
        }
        await pooldb.query('insert into edu set ?', [newLink]);
        req.flash('success', 'Apoyo guardado correctamente');
        res.redirect('/edu');//despues de recibir eenvia a links
    }
});
// mostrar contenido guardados
router.get('/:id2',isLoggedIn, async (req, res) => {
    const {id2} = req.params;
    const edu = await pooldb.query('SELECT e.*, ce.* FROM edu AS e INNER JOIN cursosEdu AS ce ON e.id = ce.edu_id where cursos_id=?',[id2] );
    res.render('edu/list', { edu, id2 });
});
router.get('/eduE',isLoggedIn, async (req, res) => {
    const edu = await pooldb.query('select * from edu' );
    console.log(edu);
    res.render('edu/list', { edu });
});
//eliminar link
router.get('/delete/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const {id2} = req.params;
    await pooldb.query('delete from cursosEdu where edu_id = ?', [id]);
    await pooldb.query('delete from edu where id = ?', [id]);
    req.flash('success', 'Apoyo eliminado correctamente');
    res.redirect('/edu/'+id2);
});
router.get('/deleteA/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    await pooldb.query('delete from edu where id = ?', [id]);
    req.flash('success', 'Apoyo eliminado correctamente');
    res.redirect('/edu/eduE');
});
//editar edu
router.get('/edit/:id/:id2',isLoggedIn, async (req, res)=>{
   const {id} = req.params;
   const {id2} = req.params;
    const edu = await pooldb.query('select * from edu where id =?',[id]);
    res.render('edu/edit', {edu: edu[0],id2}) 
});
router.post('/edit/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const {title,url,description,imagen} = req.body;
    if (title===""||url===""||description===""||imagen===""){
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/edu/edit/'+id+'/'+id2);
    }else {
        const newLink = {
            title, description, url,imagen,
        };
        await pooldb.query('update edu set ? where id=?', [newLink, id]);
        req.flash('success', 'Apoyo editado correctamente.');
        res.redirect('/edu/'+id2);
    }
});
router.post('/editE/:id',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {title,url,description,imagen} = req.body;
    if (title===""||url===""||description===""||imagen===""){
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/edu/edit/'+id);
    }else {
        const newLink = {
            title, description, url,imagen,
        };
        await pooldb.query('update edu set ? where id=?', [newLink, id]);
        req.flash('success', 'Apoyo editado correctamente');
        res.redirect('/edu/eduE');
    }
});
module.exports = router;