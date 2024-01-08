const express = require('express');
const router = express.Router();

const pooldb = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add/:id',isLoggedIn, (req, res)=>{
    const {id} = req.params;
    res.render('rimas/add',{id:id});
});
// añadir rima
router.post('/add/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const { title, description,frase1, correct1, incorrect1,frase2, correct2, incorrect2,frase3, correct3, incorrect3,incorrect4,incorrect5,incorrect6,incorrect7,incorrect8,incorrect9 } = req.body;
    if (title===""||description===""||frase1===""||correct1===""||incorrect1===""||frase2===""||correct2===""||incorrect2===""||frase3===""||correct3===""||incorrect3===""||incorrect4===""||incorrect5===""||incorrect6===""||incorrect7===""||incorrect8===""||incorrect9===""){
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/rimas/add/'+id);
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
            incorrect3,
            incorrect4,
            incorrect5,
            incorrect6,
            incorrect7,
            incorrect8,
            incorrect9,
            fk_user_id: req.user.id
        }
        const consulta = await pooldb.query('insert into rimas set ?', [newLink]);
        await pooldb.query('insert into cursosRimas (rimas_id,cursos_id) values (?,?)', [consulta.insertId,id]);
        req.flash('success', 'Rimas guardado correctamente');
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
// mostrar rimas guardados
router.get('/',isLoggedIn, async (req, res) => {
    const rimas = await pooldb.query('select * from rimas where fk_user_id = ?',[req.user.id] );
    console.log(rimas);
    res.render('rimas/list', { rimas });
});
router.get('/rimasE',isLoggedIn, async (req, res) => {
    const rimas = await pooldb.query('select * from rimas' );
    console.log(rimas);
    res.render('rimas/list', { rimas });
});
//eliminar rima
router.get('/delete/:id/:id2/',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const {id2} = req.params;
    await pooldb.query('delete from respuestas where fk_id_rimas = ?', [id]);
    await pooldb.query('delete from cursosRimas where rimas_id = ?', [id]);
    await pooldb.query('delete from rimas where id = ?', [id]);
    req.flash('success', 'Rimas eliminado correctamente');
    res.redirect('/cursos/edit2/'+id2);
});
//editar rima
router.get('/edit/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const {id2} = req.params;
    const rimas = await pooldb.query('select * from rimas where id =?',[id]);
    res.render('rimas/edit', {rimas: rimas[0],id2})
});
router.post('/edit/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const {title, description,frase1, correct1, incorrect1,frase2, correct2, incorrect2,frase3, correct3, incorrect3,incorrect4,incorrect5,incorrect6,incorrect7,incorrect8,incorrect9} = req.body;
    if (title===""||description===""||frase1===""||correct1===""||incorrect1===""||frase2===""||correct2===""||incorrect2===""||frase3===""||correct3===""||incorrect3===""||incorrect4===""||incorrect5===""||incorrect6===""||incorrect7===""||incorrect8===""||incorrect9===""){
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/rimas/edit/'+id+'/'+id2);
    }else {
        const newLink = {
            title, description,frase1, correct1, incorrect1,frase2, correct2, incorrect2,frase3, correct3, incorrect3, incorrect4,
            incorrect5,
            incorrect6,
            incorrect7,
            incorrect8,
            incorrect9,
        };
        await pooldb.query('update rimas set ? where id=?', [newLink, id]);
        req.flash('success', 'Rimas editado correctamente');
        res.redirect('/cursos/edit2/'+id2);   
    }
});

//ver rima
router.get('/viewR/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const rimas = await pooldb.query('select * from rimas where id =?',[id]);
    const arr1 = [rimas[0].correct1,rimas[0].incorrect1,rimas[0].incorrect4,rimas[0].incorrect5];
    const arr2 = [rimas[0].correct2,rimas[0].incorrect2,rimas[0].incorrect6,rimas[0].incorrect7];
    const arr3 = [rimas[0].correct3,rimas[0].incorrect3,rimas[0].incorrect8,rimas[0].incorrect9];
    arr1.sort(function() { return Math.random() - 0.5 });
    arr2.sort(function() { return Math.random() - 0.5 });
    arr3.sort(function() { return Math.random() - 0.5 });
    res.render('rimas/viewR', {rimas: rimas[0],arr1,arr2,arr3,id2})
});

//acabar actividad rima
router.post('/rimaComplete/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const rimas = await pooldb.query('select * from rimas where id =?',[id2]);
    const respuestas = rimas[0];
    const {respuestasRima1,respuestasRima2,respuestasRima3} = req.body;
    let score = 0;
    if (respuestas.correct1 === respuestasRima1){
        score += 1;
    }
    if (respuestas.correct2 === respuestasRima2){
        score += 1;
    }
    if (respuestas.correct3 === respuestasRima3){
        score += 1;
    }
    const test = await pooldb.query('select * from respuestas where fk_id_usersE = ? and fk_id_rimas =?', [id,id2]);
    if (test.length > 0){
        tries = test[0].intentos +1 ;
        await pooldb.query('update respuestas set score_rimas=?, intentos = ? where fk_id_usersE = ? and fk_id_rimas = ?', [score,tries,id,id2]);   
    }
    else {
        await pooldb.query('INSERT INTO respuestas (fk_id_usersE, fk_id_rimas, score_rimas, intentos) VALUES (?,?,?,?)', [id, id2, score, 1]);
    }
    await pooldb.query('UPDATE respuestas SET createdat =now() where fk_id_rimas= ?',[id2]);
    //await pooldb.query('INSERT INTO respuestas (fk_id_usersE, fk_id_rimas, score_rimas) VALUES (?,?,?)', [id,id2,score]);
    res.redirect('/rimas/score/'+id+'/'+id2);
});

//retroalimentacion rima
router.get('/score/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {id2}= req.params;
    const score = await pooldb.query('select * from respuestas where fk_id_usersE = ? and fk_id_rimas=?;',[id,id2]);
    console.log("consulta: ", score)
    if (score[0].score_rimas===3){
        const score3=true;
        console.log("score 333")
        res.render('rimas/score', {score: score[0],score3})
    }else if (score[0].score_rimas===2){
        const score2 =true;
        console.log("score 222")
        res.render('rimas/score', {score: score[0],score2})
    }else if (score[0].score_rimas===1){
        const score1 = true;
        console.log("score 111")
        res.render('rimas/score', {score: score[0],score1})
    }else if (score[0].score_rimas===0){
        const score0 = true;
        console.log("score 000")
        res.render('rimas/score', {score: score[0],score0})
    }
});



module.exports = router;