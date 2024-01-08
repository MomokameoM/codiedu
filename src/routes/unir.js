const express = require('express');
const router = express.Router();

const pooldb = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add/:id',isLoggedIn, (req, res)=>{
    const {id} = req.params;
    res.render('unir/add',{id:id});
});
// añadir unir
router.post('/add/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const { title, description,palabra1, imagen1,palabra2, imagen2,palabra3, imagen3, incorrect1,incorrect2,incorrect3 } = req.body;
    if (title===""||description===""||palabra1===""||imagen1===""||palabra2===""||imagen2===""||palabra3===""||imagen3===""||incorrect1===""||incorrect2===""||incorrect3===""){
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/unir/add');
    }else {
        const newLink= {
            title,
            description,
            palabra1,
            imagen1,
            palabra2,
            imagen2,
            palabra3,
            imagen3, incorrect1,incorrect2,incorrect3,
            fk_user_id: req.user.id
        }
        const consulta =await pooldb.query('insert into unir set ?', [newLink]);
        await pooldb.query('insert into cursosUnir (unir_id,cursos_id) values (?,?)', [consulta.insertId,id]);
        req.flash('success', 'Unir guardado correctamente');
        res.redirect('/cursos/edit2/'+id);
    }
});

router.get('/add2',isLoggedIn, (req, res)=>{
    res.render('edu/add2');
});
// añadir enlaces2
router.post('/add2',isLoggedIn, async (req, res)=>{
    const { title, url, description, imagen } = req.body;
    const newLink= {
        title,
        url,
        description,
        imagen,
        fk_user_id: req.user.id
    }
    await pooldb.query('insert into edu set ?', [newLink]);
    req.flash('success', 'Apoyo guardado correctamente');
    res.redirect('/rimas');//despues de recibir eenvia a links
});
// mostrar unir guardados
router.get('/',isLoggedIn, async (req, res) => {
    const unir = await pooldb.query('select * from unir where fk_user_id = ?',[req.user.id] );
    res.render('unir/list', { unir });
});
router.get('/unirE',isLoggedIn, async (req, res) => {
    const unir = await pooldb.query('select * from unir' );
    res.render('unir/list', { unir });
});
//eliminar unir
router.get('/delete/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const {id2} = req.params;
    await pooldb.query('delete from respuestasU where fk_id_unir= ?', [id]);
    await pooldb.query('delete from cursosUnir where unir_id = ?', [id]);
    await pooldb.query('delete from unir where id = ?', [id]);
    req.flash('success', 'Unir eliminado correctamente');
    res.redirect('/cursos/edit2/'+id2);
});
//editar unir
router.get('/edit/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const {id2} = req.params;
    const unir = await pooldb.query('select * from unir where id =?',[id]);
    res.render('unir/edit', {unir: unir[0],id2})
});
router.post('/edit/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const { title, description,palabra1, imagen1,palabra2, imagen2,palabra3, imagen3, incorrect1,incorrect2,incorrect3 } = req.body;
    if (title===""||description===""||palabra1===""||imagen1===""||palabra2===""||imagen2===""||palabra3===""||imagen3===""||incorrect1===""||incorrect2===""||incorrect3===""){
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/unir/edit/'+id+'/'+id2);
    }else {
        const newLink = {
            title,
            description,
            palabra1,
            imagen1,
            palabra2,
            imagen2,
            palabra3,
            imagen3, incorrect1,incorrect2,incorrect3,
            fk_user_id: req.user.id
        }
        await pooldb.query('update unir set ? where id=?', [newLink, id]);
        req.flash('success', 'Unir editado correctamente');
        res.redirect('/cursos/edit2/'+id2);
    }
});

//ver unir
router.get('/viewU/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const unir = await pooldb.query('select * from unir where id =?',[id]);
    console.log(unir)
    const arr1 = [unir[0].palabra1,unir[0].incorrect1];
    const arr2 = [unir[0].palabra2,unir[0].incorrect2];
    const arr3 = [unir[0].palabra3,unir[0].incorrect3];
    arr1.sort(function() { return Math.random() - 0.5 });
    arr2.sort(function() { return Math.random() - 0.5 });
    arr3.sort(function() { return Math.random() - 0.5 });
    res.render('unir/viewU', {unir: unir[0],id2,arr3,arr1,arr2})
});
//acabar actividad unir
router.post('/unirComplete/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const unir = await pooldb.query('select * from unir where id =?',[id2]);
    const respuestas = unir[0];
    const {respuesta1,respuesta2,respuesta3} = req.body;
    console.log(respuesta1,respuesta2,respuesta3);
    console.log(respuestas.palabra1,respuestas.palabra2,respuestas.palabra3);
    let score = 0;
    switch (respuestas.palabra1){
        case respuesta1:
            score += 1;
            break;
    }
    switch (respuestas.palabra2){
        case respuesta2:
            score += 1;
            break;
    }
    switch (respuestas.palabra3){
        case respuesta3:
            score += 1;
            break;
    }
    const test = await pooldb.query('select * from respuestasU where fk_id_usersE = ? and fk_id_unir =?', [id,id2]);
    if (test.length > 0){
        tries = test[0].intentos +1 ;
        await pooldb.query('update respuestasU set score_unir=?, intentos = ? where fk_id_usersE = ? and fk_id_unir = ?', [score,tries,id,id2]);
    }
    else {
        await pooldb.query('INSERT INTO respuestasU (fk_id_usersE, fk_id_unir, score_unir, intentos) VALUES (?,?,?,?)', [id, id2, score, 1]);
    }
    await pooldb.query('UPDATE respuestasU SET createdat =now() where fk_id_unir= ?',[id2]);
    res.redirect('/unir/score/'+id+'/'+id2);
});
//retroalimentacion unir
router.get('/score/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const score = await pooldb.query('select * from respuestasU where fk_id_usersE = ? and fk_id_unir=?;',[id,id2]);
    if (score[0].score_unir===3){
        const score3=true;
        console.log("score 333")
        res.render('unir/score', {score: score[0],score3})
    }else if (score[0].score_unir===2){
        const score2 =true;
        console.log("score 222")
        res.render('unir/score', {score: score[0],score2})
    }else if (score[0].score_unir===1){
        const score1 = true;
        console.log("score 111")
        res.render('unir/score', {score: score[0],score1})
    }else if (score[0].score_unir===0){
        const score0 = true;
        console.log("score 000")
        res.render('unir/score', {score: score[0],score0})
    }
});





module.exports = router;