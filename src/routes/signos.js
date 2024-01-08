const express = require('express');
const router = express.Router();

const pooldb = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add/:id',isLoggedIn, (req, res)=>{
    const {id} = req.params;
    res.render('signos/add', {id:id});
});
// añadir signos
router.post('/add/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const { title, description,frase1, correct1,frase2, correct2,frase3, correct3 } = req.body;
    let incorrect1 ="";
    let incorrect2 ="";
    let incorrect3 ="";
    switch (correct1){
        case '¿?':
            incorrect1= "¡!";
            break;
        case '¡!':
            incorrect1= "¿?";
            break;
    }
    switch (correct2) {
        case '¿?':
             incorrect2 = "¡!";
            break;
        case '¡!':
             incorrect2 = "¿?";
            break;
    }
    switch (correct3) {
        case '¿?':
             incorrect3 = "¡!";
            break;
        case '¡!':
             incorrect3 = "¿?";
            break;
    }
    if (title===""||description===""||frase1===""||correct1===""||frase2===""||correct2===""||frase3===""||correct3===""){
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/signos/add');
    }else {
        const newLink= {
            title,
            description,
            frase1,
            correct1,
            frase2,
            correct2,
            frase3,
            correct3,
            incorrect1,
            incorrect2,
            incorrect3,
            fk_user_id: req.user.id
        }
        const consulta = await pooldb.query('insert into signos set ?', [newLink]);
        await pooldb.query('insert into cursosSignos (signos_id,cursos_id) values (?,?)', [consulta.insertId,id]);
        req.flash('success', 'Signos guardado correctamente');
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
// mostrar signos guardados
router.get('/',isLoggedIn, async (req, res) => {
    const signos = await pooldb.query('select * from signos where fk_user_id = ?',[req.user.id] );
    res.render('signos/list', { signos });
});
router.get('/signosE',isLoggedIn, async (req, res) => {
    const signos = await pooldb.query('select * from signos' );
    res.render('signos/list', { signos });
});
//eliminar signo
router.get('/delete/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const {id2} = req.params;
    await pooldb.query('delete from respuestasS where fk_id_signos= ?', [id]);
    await pooldb.query('delete from cursosSignos where signos_id = ?', [id]);
    await pooldb.query('delete from signos where id = ?', [id]);
    req.flash('success', 'Signos eliminado correctamente');
    res.redirect('/cursos/edit2/'+id2);
});
//editar signo
router.get('/edit/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const {id2} = req.params;
    const signos = await pooldb.query('select * from signos where id =?',[id]);
    res.render('signos/edit', {signos: signos[0],id2})
});
router.post('/edit/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2} = req.params;
    const {title, description,frase1, correct1,frase2, correct2,frase3, correct3} = req.body;
    if (title===""||description===""||frase1===""||correct1===""||frase2===""||correct2===""||frase3===""||correct3===""){
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/signos/edit/'+id+'/'+id2);
    }else {
        let incorrect1 ="";
        let incorrect2 ="";
        let incorrect3 ="";
        switch (correct1){
            case '¿?':
                incorrect1= "¡!";
                break;
            case '¡!':
                incorrect1= "¿?";
                break;
        }
        switch (correct2) {
            case '¿?':
                incorrect2 = "¡!";
                break;
            case '¡!':
                incorrect2 = "¿?";
                break;
        }
        switch (correct3) {
            case '¿?':
                incorrect3 = "¡!";
                break;
            case '¡!':
                incorrect3 = "¿?";
                break;
        }
        const newLink = {
            title, description,frase1, correct1,frase2, correct2,frase3, correct3,incorrect1,incorrect2,incorrect3
        };
        await pooldb.query('update signos set ? where id=?', [newLink, id]);
        req.flash('success', 'Signos editado correctamente');
        res.redirect('/cursos/edit2/'+id2);
    }
});

//ver signo
router.get('/viewS/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const signos = await pooldb.query('select * from signos where id =?',[id]);
    res.render('signos/viewS', {signos: signos[0],id2})
});

//acabar actividad signo
router.post('/signosComplete/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const signos = await pooldb.query('select * from signos where id =?',[id2]);
    console.log(signos);
    const respuestas = signos[0];
    const {respuesta1,respuesta2,respuesta3} = req.body;
    let score = 0;
    if (respuestas.correct1 === respuesta1){
        score += 1;
    }
    if (respuestas.correct2 === respuesta2){
        score += 1;
    }
    if (respuestas.correct3 === respuesta3){
        score += 1;
    }
    const test = await pooldb.query('select * from respuestasS where fk_id_usersE = ? and fk_id_signos =?', [id,id2]);
    if (test.length > 0){
        tries = test[0].intentos +1 ;
        await pooldb.query('update respuestasS set score_signos=?, intentos = ? where fk_id_usersE = ? and fk_id_signos = ?', [score,tries,id,id2]);
    }
    else {
        await pooldb.query('INSERT INTO respuestasS (fk_id_usersE, fk_id_signos, score_signos, intentos) VALUES (?,?,?,?)', [id, id2, score, 1]);
    }
    await pooldb.query('UPDATE respuestasS SET createdat =now() where fk_id_signos= ?',[id2]);
    //await pooldb.query('INSERT INTO respuestas (fk_id_usersE, fk_id_rimas, score_rimas) VALUES (?,?,?)', [id,id2,score]);
    res.redirect('/signos/score/'+id+'/'+id2);
});
//retroalimentacion signos
router.get('/score/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const score = await pooldb.query('select * from respuestasS where fk_id_usersE = ? and fk_id_signos=?;',[id,id2]);
    if (score[0].score_signos===3){
        const score3=true;
        console.log("score 333")
        res.render('signos/score', {score: score[0],score3})
    }else if (score[0].score_signos===2){
        const score2 =true;
        console.log("score 222")
        res.render('signos/score', {score: score[0],score2})
    }else if (score[0].score_signos===1){
        const score1 = true;
        console.log("score 111")
        res.render('signos/score', {score: score[0],score1})
    }else if (score[0].score_signos===0){
        const score0 = true;
        console.log("score 000")
        res.render('signos/score', {score: score[0],score0})
    }
});




module.exports = router;