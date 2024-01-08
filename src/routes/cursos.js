const express = require('express');
const router = express.Router();

const pooldb = require('../database');
const {isLoggedIn} = require('../lib/auth');
const helpers = require("../lib/helpers");


router.get('/unirse',isLoggedIn, (req, res)=>{
    res.render('cursos/unirse');
});

router.post('/unirse',isLoggedIn, async (req, res)=>{
    const {token} = req.body;
    if (token==="") {
        req.flash('message', 'Inserte un codigo');
        res.redirect('/cursos/unirse/');
    }else {
        const tokenExist = await pooldb.query('select * from cursos where token= ?', [token]);
        if (tokenExist.length>0){
            const cursoExist = await pooldb.query('SELECT ca.* FROM cursos AS c INNER JOIN cursosAlumnos AS ca ON c.id = ca.cursos_id where token=? and users_id=?', [token,req.user.id]);
            if (cursoExist.length>0){
                req.flash('message', 'Ya estas inscrito a ese curso');
                res.redirect('/cursos/unirse/');
            }else {
                const cursos_id = tokenExist[0].id;
                const newLink= {
                    users_id: req.user.id,
                    cursos_id
                }
                await pooldb.query('insert into cursosAlumnos set ?', [newLink]);
                req.flash('success', 'Has ingresado al curso correctamente');
                res.redirect('/cursos/liste');
            }
        }else {
            req.flash('message', 'Ese codigo no existe');
            res.redirect('/cursos/unirse/');
        }
    }
});


router.get('/add',isLoggedIn, (req, res)=>{
    res.render('cursos/add');
});
// añadir cursos
router.post('/add',isLoggedIn, async (req, res)=>{
    const { title, description } = req.body;
    if (title===""||description==="") {
        req.flash('message', 'Rellene todos los campos');
        
        res.redirect('/cursos/add');
    }else{
        const token = helpers.randomToken(6);
        let tokenExist = await pooldb.query('select * from cursos where token= ?', [token]);
        while (tokenExist.length>0){
            const token = helpers.randomToken(6);
            tokenExist = await pooldb.query('select * from cursos where token= ?', [token]);
        }
        const newLink= {
            title,
            description,
            user_id: req.user.id,
            token
        }
        await pooldb.query('insert into cursos set ?', [newLink]);
        req.flash('success', 'Curso guardado correctamente');
        res.redirect('/cursos');//despues de recibir eenvia a links
    }
});

router.get('/add2/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const cursos = await pooldb.query('select * from cursos where id =?',[id]);
    res.render('cursos/add2', {cursos: cursos[0]})
});

// mostrar cursos guardados
router.get('/',isLoggedIn, async (req, res) => {
    let cursos =[];
    cursos = await pooldb.query('select * from cursos where user_id = ?',[req.user.id] );
    //const rimas = await pooldb.query('SELECT r.*, c.*,cr.* FROM rimas AS r INNER JOIN cursosRimas AS cr ON r.id = cr.rimas_id INNER JOIN cursos AS c ON c.id = cr.cursos_id where fk_user_id=?',[req.user.id]);
    //const oraciones = await pooldb.query('SELECT o.id, c.id,co.id,o.title,o.fk_user_id FROM oraciones AS o INNER JOIN cursosOraciones AS co ON o.id = co.oraciones_id INNER JOIN cursos AS c ON c.id = co.cursos_id where cursos_id=?',[cursos.id]);
    //const signos = await pooldb.query('SELECT s.id, c.id,co.id,s.title,s.fk_user_id FROM signos AS s INNER JOIN cursosSignos AS co ON s.id = co.signos_id INNER JOIN cursos AS c ON c.id = co.cursos_id where cursos_id=?', [cursos.id]);
    //const unir = await pooldb.query('SELECT s.id, c.id,co.id,s.title,s.fk_user_id FROM unir AS s INNER JOIN cursosUnir AS co ON s.id = co.unir_id INNER JOIN cursos AS c ON c.id = co.cursos_id where cursos_id=?', [cursos.id]);
    //const edu = await pooldb.query('SELECT e.*, ce.* FROM edu AS e INNER JOIN cursosEdu AS ce ON e.id = ce.edu_id where cursos_id=?',[cursos.id]);
    res.render('cursos/list', { cursos });
});

router.get('/liste',isLoggedIn, async (req, res) => {
    const cursos = await pooldb.query('SELECT c.*, ca.* FROM cursos AS c INNER JOIN cursosAlumnos AS ca ON c.id = ca.cursos_id where users_id=?',[req.user.id]);
    console.log(cursos)
    //const rimas = await pooldb.query('SELECT r.*, c.*,cr.* FROM rimas AS r INNER JOIN cursosRimas AS cr ON r.id = cr.rimas_id INNER JOIN cursos AS c ON c.id = cr.cursos_id where fk_user_id=?',[req.user.id]);
    //const oraciones = await pooldb.query('SELECT o.id, c.id,co.id,o.title,o.fk_user_id FROM oraciones AS o INNER JOIN cursosOraciones AS co ON o.id = co.oraciones_id INNER JOIN cursos AS c ON c.id = co.cursos_id where cursos_id=?',[cursos.id]);
    //const signos = await pooldb.query('SELECT s.id, c.id,co.id,s.title,s.fk_user_id FROM signos AS s INNER JOIN cursosSignos AS co ON s.id = co.signos_id INNER JOIN cursos AS c ON c.id = co.cursos_id where cursos_id=?', [cursos.id]);
    //const unir = await pooldb.query('SELECT s.id, c.id,co.id,s.title,s.fk_user_id FROM unir AS s INNER JOIN cursosUnir AS co ON s.id = co.unir_id INNER JOIN cursos AS c ON c.id = co.cursos_id where cursos_id=?', [cursos.id]);
    //const edu = await pooldb.query('SELECT e.*, ce.* FROM edu AS e INNER JOIN cursosEdu AS ce ON e.id = ce.edu_id where cursos_id=?',[cursos.id]);
    res.render('cursos/liste', { cursos });
});


//eliminar curso
router.get('/delete/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    //borrar  de edu
    await pooldb.query('delete e.*, ce.* FROM edu AS e INNER JOIN cursosEdu AS ce ON e.id = ce.edu_id where cursos_id=?', [id]);
    //borrar de rimas
    const consultaR = await pooldb.query('SELECT r.*, cr.*,rr.* FROM rimas AS r INNER JOIN cursosRimas AS cr ON r.id = cr.rimas_id INNER JOIN respuestas AS rr ON rr.fk_id_rimas=r.id where cursos_id=?', [id]);
    if (consultaR.length<1){
        await pooldb.query('delete r.*, cr.* FROM rimas AS r INNER JOIN cursosRimas AS cr ON r.id = cr.rimas_id where cursos_id=?',[id]);
    }else {
        await pooldb.query('set FOREIGN_KEY_CHECKS= 0'); //to disable them
        await pooldb.query('delete r.*, cr.*,rr.* FROM rimas AS r INNER JOIN cursosRimas AS cr ON r.id = cr.rimas_id INNER JOIN respuestas AS rr ON rr.fk_id_rimas=r.id where cursos_id=?', [id]);
        await pooldb.query('SET FOREIGN_KEY_CHECKS=1'); //to re-enable them
    }
    //borrar de oraciones
    const consultaO = await pooldb.query('select  cr.*,r.*,rr.* FROM cursosOraciones AS cr INNER JOIN respuestasO AS rr ON rr.fk_id_oraciones = cr.oraciones_id INNER JOIN oraciones AS r ON r.id=rr.fk_id_oraciones where cursos_id=?', [id]);
    if (consultaO.length<1){
        await pooldb.query('delete r.*, cr.* FROM oraciones AS r INNER JOIN cursosOraciones AS cr ON r.id = cr.oraciones_id where cursos_id=?',[id]);
    }else {
        await pooldb.query('set FOREIGN_KEY_CHECKS= 0'); //to disable them
        await pooldb.query('delete  cr.*,r.*,rr.* FROM cursosOraciones AS cr INNER JOIN respuestasO AS rr ON rr.fk_id_oraciones = cr.oraciones_id INNER JOIN oraciones AS r ON r.id=rr.fk_id_oraciones where cursos_id=?', [id]);
        await pooldb.query('SET FOREIGN_KEY_CHECKS=1'); //to re-enable them
    }
    //borrar  de signos
    const consultaS = await pooldb.query('select  cr.*,r.*,rr.* FROM cursosSignos AS cr INNER JOIN respuestasS AS rr ON rr.fk_id_signos = cr.signos_id INNER JOIN signos AS r ON r.id=rr.fk_id_signos where cursos_id=?', [id]);
    if (consultaS.length<1){
        await pooldb.query('delete r.*, cr.* FROM signos AS r INNER JOIN cursosSignos AS cr ON r.id = cr.signos_id where cursos_id=?',[id]);
    }else {
        await pooldb.query('set FOREIGN_KEY_CHECKS= 0'); //to disable them
        await pooldb.query('delete  cr.*,r.*,rr.* FROM cursosSignos AS cr INNER JOIN respuestasS AS rr ON rr.fk_id_signos = cr.signos_id INNER JOIN signos AS r ON r.id=rr.fk_id_signos where cursos_id=?', [id]);
        await pooldb.query('SET FOREIGN_KEY_CHECKS=1'); //to re-enable them
    }
    //borrar de unir
    const consultaU = await pooldb.query('select  cr.*,r.*,rr.* FROM cursosUnir AS cr INNER JOIN respuestasU AS rr ON rr.fk_id_unir = cr.unir_id INNER JOIN unir AS r ON r.id=rr.fk_id_unir where cursos_id=?', [id]);
    if (consultaU.length<1){
        await pooldb.query('delete r.*, cr.* FROM unir AS r INNER JOIN cursosUnir AS cr ON r.id = cr.unir_id where cursos_id=?',[id]);
    }else {
        await pooldb.query('set FOREIGN_KEY_CHECKS= 0'); //to disable them
        await pooldb.query('delete  cr.*,r.*,rr.* FROM cursosUnir AS cr INNER JOIN respuestasU AS rr ON rr.fk_id_unir = cr.unir_id INNER JOIN unir AS r ON r.id=rr.fk_id_unir where cursos_id=?', [id]);
        await pooldb.query('SET FOREIGN_KEY_CHECKS=1'); //to re-enable them
    }
    //borrar de cursosalumnos
    const consultaA = await pooldb.query('select  ca.*,c.* FROM cursosAlumnos AS ca INNER JOIN cursos AS c ON ca.cursos_id = c.id where cursos_id=?', [id]);
    if (consultaA.length<1){
        await pooldb.query('delete from cursos where id = ?', [id]);
    }else {
        await pooldb.query('set FOREIGN_KEY_CHECKS= 0'); //to disable them
        await pooldb.query('delete  ca.*,c.* FROM cursosAlumnos AS ca INNER JOIN cursos AS c ON ca.cursos_id = c.id where cursos_id=?', [id]);
        await pooldb.query('SET FOREIGN_KEY_CHECKS=1'); //to re-enable them
    }
    req.flash('success', 'Curso eliminado correctamente');
    res.redirect('/cursos');
});

router.get('/delete2/:id',isLoggedIn, async (req, res)=> {
    const {id} = req.params;
    //await pooldb.query('delete from respuestas where fk_id_rimas = ?', [id]);
    await pooldb.query('delete from cursosRimas where cursos_id = ?', [id]);
    await pooldb.query('delete from cursosOraciones where cursos_id = ?', [id]);
    await pooldb.query('delete from cursosSignos where cursos_id = ?', [id]);
    await pooldb.query('delete from cursosUnir where cursos_id = ?', [id]);
    await pooldb.query('delete from cursos where id = ?', [id]);
    req.flash('success', 'Curso eliminado correctamente');
    res.redirect('/cursos');
});
    
//editar curso
router.get('/edit/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const cursos = await pooldb.query('select * from cursos where id =?',[id]);
    res.render('cursos/edit', {cursos: cursos[0]})
});
router.post('/edit/:id',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {title,description} = req.body;
    if (title===""||description==="") {
        req.flash('message', 'Rellene todos los campos');
        res.redirect('/cursos/edit/'+ id);
    }else {
        const newLink = {
            title, description
        };
        await pooldb.query('update cursos set ? where id=?', [newLink, id]);
        req.flash('success', 'Curso editado correctamente');
        res.redirect('/cursos');  
    }
});

router.get('/edit2/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const cursos = await pooldb.query('select * from cursos where id =?',[id]);
    const unir = await pooldb.query('SELECT u.*, cu.* FROM unir AS u INNER JOIN cursosUnir AS cu ON u.id = cu.unir_id where cursos_id=?',[cursos[0].id]);
    const rimas = await pooldb.query('SELECT r.*, cr.* FROM rimas AS r INNER JOIN cursosRimas AS cr ON r.id = cr.rimas_id where cursos_id=?',[cursos[0].id]);
    const oraciones = await pooldb.query('SELECT o.*, co.* FROM oraciones AS o INNER JOIN cursosOraciones AS co ON o.id = co.oraciones_id where cursos_id=?',[cursos[0].id]);
    const signos = await pooldb.query('SELECT s.*, cs.* FROM signos AS s INNER JOIN cursosSignos AS cs ON s.id = cs.signos_id where cursos_id=?',[cursos[0].id]);
    res.render('cursos/edit2', {cursos: cursos[0], unir,rimas,oraciones,signos,id})
});
module.exports = router;