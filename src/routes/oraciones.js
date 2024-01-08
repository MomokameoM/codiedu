const express = require('express');
const router = express.Router();

const pooldb = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add/:id',isLoggedIn, (req, res)=>{
    const {id} = req.params;
    res.render('oraciones/add',{id:id});
});
// añadir oracion
router.post('/add/:id',isLoggedIn, async (req, res)=>{
    const { title, description,frase1, correct1, incorrect1,frase2, correct2, incorrect2,frase3, correct3, incorrect3,incorrect4,incorrect5,incorrect6,incorrect7,incorrect8,incorrect9 } = req.body;
    const {id} = req.params;
    if (title===""||description===""||frase1===""||correct1===""||incorrect1===""||frase2===""||correct2===""||incorrect2===""||frase3===""||correct3===""||incorrect3===""||incorrect4===""||incorrect5===""||incorrect6===""||incorrect7===""||incorrect8===""||incorrect9===""){
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/oraciones/add/'+id);
    }else {
        const newLink= {
            title,
            description,
            frase1,
            correct1,
            incorrect1,
            frase2,
            correct2,
            incorrect2,
            frase3,
            correct3,
            incorrect3,incorrect4,incorrect5,incorrect6,incorrect7,incorrect8,incorrect9,
            fk_user_id: req.user.id
        }
        const consulta= await pooldb.query('insert into oraciones set ?', [newLink]);
        await pooldb.query('insert into cursosOraciones (oraciones_id,cursos_id) values (?,?)', [consulta.insertId,id]);
        req.flash('success', 'Oraciones guardado correctamente');
        res.redirect('/cursos/edit2/'+id);//despues de recibir eenvia a links
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
// mostrar oraciones guardados
router.get('/',isLoggedIn, async (req, res) => {
    const oraciones = await pooldb.query('select * from oraciones where fk_user_id = ?',[req.user.id] );
    res.render('oraciones/list', { oraciones });
});
router.get('/oracionesE',isLoggedIn, async (req, res) => {
    const oraciones = await pooldb.query('select * from oraciones' );
    res.render('oraciones/list', { oraciones });
});
//eliminar oracion
router.get('/delete/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const {id2} = req.params;
    await pooldb.query('delete from respuestasO where fk_id_oraciones = ?', [id]);
    await pooldb.query('delete from cursosOraciones where oraciones_id = ?', [id]);
    await pooldb.query('delete from oraciones where id = ?', [id]);
    req.flash('success', 'Oraciones eliminado correctamente');
    res.redirect('/cursos/edit2/'+id2);
});
//editar oracion
router.get('/edit/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const {id2} = req.params;
    const oraciones = await pooldb.query('select * from oraciones where id =?',[id]);
    res.render('oraciones/edit', {oraciones: oraciones[0],id2});
});
router.post('/edit/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const {title, description,frase1, correct1, incorrect1,frase2, correct2, incorrect2,frase3, correct3, incorrect3,incorrect4,incorrect5,incorrect6,incorrect7,incorrect8,incorrect9} = req.body;
    if (title===""||description===""||frase1===""||correct1===""||incorrect1===""||frase2===""||correct2===""||incorrect2===""||frase3===""||correct3===""||incorrect3===""||incorrect4===""||incorrect5===""||incorrect6===""||incorrect7===""||incorrect8===""||incorrect9==="") {
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/oraciones/edit/'+id+'/'+id2);
    }else {
        const newLink = {
            title, description,frase1, correct1, incorrect1,frase2, correct2, incorrect2,frase3, correct3, incorrect3,incorrect4,incorrect5,incorrect6,incorrect7,incorrect8,incorrect9,
        };
        await pooldb.query('update oraciones set ? where id=?', [newLink, id]);
        req.flash('success', 'Oraciones editado correctamente');
        res.redirect('/cursos/edit2/'+id2);    
    }
});

//ver oracion
router.get('/viewO/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params
    const oraciones = await pooldb.query('select * from oraciones where id =?',[id]);
    const arr1 = [oraciones[0].correct1,oraciones[0].incorrect1,oraciones[0].incorrect4,oraciones[0].incorrect5];
    const arr2 = [oraciones[0].correct2,oraciones[0].incorrect2,oraciones[0].incorrect6,oraciones[0].incorrect7];
    const arr3 = [oraciones[0].correct3,oraciones[0].incorrect3,oraciones[0].incorrect8,oraciones[0].incorrect9];
    arr1.sort(function() { return Math.random() - 0.5 });
    arr2.sort(function() { return Math.random() - 0.5 });
    arr3.sort(function() { return Math.random() - 0.5 });
    res.render('oraciones/viewO', {oraciones: oraciones[0], id2,arr3,arr1,arr2})
});

//acabar actividad oraciones
router.post('/oracionesComplete/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const oraciones = await pooldb.query('select * from oraciones where id =?',[id2]);
    const respuestas = oraciones[0];
    const {respuestasOracion1,respuestasOracion2,respuestasOracion3} = req.body;
    let score = 0;
    if (respuestas.correct1 === respuestasOracion1){
        score += 1;
    }
    if (respuestas.correct2 === respuestasOracion2){
        score += 1;
    }
    if (respuestas.correct3 === respuestasOracion3){
        score += 1;
    }
    const test = await pooldb.query('select * from respuestasO where fk_id_usersE = ? and fk_id_oraciones =?', [id,id2]);
    if (test.length > 0){
        tries = test[0].intentos +1 ;
        await pooldb.query('update respuestasO set score_oraciones=?, intentos = ? where fk_id_usersE = ? and fk_id_oraciones = ?', [score,tries,id,id2]);
    }
    else {
        await pooldb.query('INSERT INTO respuestasO (fk_id_usersE, fk_id_oraciones, score_oraciones, intentos) VALUES (?,?,?,?)', [id, id2, score, 1]);
    }
    await pooldb.query('UPDATE respuestasO SET createdat =now() where fk_id_oraciones= ?',[id2]);
    //await pooldb.query('INSERT INTO respuestas (fk_id_usersE, fk_id_rimas, score_rimas) VALUES (?,?,?)', [id,id2,score]);
    res.redirect('/oraciones/score/'+id+'/'+id2);
});
//retroalimentacion oraciones
router.get('/score/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const score = await pooldb.query('select * from respuestasO where fk_id_usersE = ? and fk_id_oraciones=?;',[id,id2]);
    console.log("consulta: ", score)
    if (score[0].score_oraciones===3){
        const score3=true;
        console.log("score 333")
        res.render('oraciones/score', {score: score[0],score3})
    }else if (score[0].score_oraciones===2){
        const score2 =true;
        console.log("score 222")
        res.render('oraciones/score', {score: score[0],score2})
    }else if (score[0].score_oraciones===1){
        const score1 = true;
        console.log("score 111")
        res.render('oraciones/score', {score: score[0],score1})
    }else if (score[0].score_oraciones===0){
        const score0 = true;
        console.log("score 000")
        res.render('oraciones/score', {score: score[0],score0})
    }
});





module.exports = router;