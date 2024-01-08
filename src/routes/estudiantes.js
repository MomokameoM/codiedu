const express = require('express');
const router = express.Router();

const pooldb = require('../database');
const {isLoggedIn} = require('../lib/auth');

// mostrar estudiantes
router.get('/:id',isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const estudiantes = await pooldb.query('SELECT u.*,ca.*,c.* FROM cursosAlumnos AS ca INNER JOIN cursos AS c ON ca.cursos_id = c.id INNER JOIN users as u on u.id=ca.users_id where ca.cursos_id=?',[id]);
    console.log(estudiantes)
    res.render('estudiantes/list', { estudiantes,id });
});
/*eliminar  estudiante
router.get('/delete/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    await pooldb.query('delete from users where id = ?', [id]);
    req.flash('success', 'estudiante eliminado correctamente');
    res.redirect('/estudiantes');
});*/
//eliminar estudiante de curso
router.get('/eject/:id/:id2',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const {id2} = req.params;
    await pooldb.query('delete rr.* FROM respuestas as rr INNER JOIN cursosRimas as cr ON rr.fk_id_rimas = cr.rimas_id WHERE fk_id_usersE=? and cursos_id=?', [id,id2]);
    await pooldb.query('delete rr.* FROM respuestasO as rr INNER JOIN cursosOraciones as cr ON rr.fk_id_oraciones = cr.oraciones_id WHERE fk_id_usersE=? and cursos_id=?', [id,id2]);
    await pooldb.query('delete rr.* FROM respuestasU as rr INNER JOIN cursosUnir as cr ON rr.fk_id_unir = cr.unir_id WHERE fk_id_usersE=? and cursos_id=?', [id,id2]);
    await pooldb.query('delete rr.* FROM respuestasS as rr INNER JOIN cursosSignos as cr ON rr.fk_id_signos = cr.signos_id WHERE fk_id_usersE=? and cursos_id=?', [id,id2]);
    await pooldb.query('delete from cursosAlumnos where users_id=? and cursos_id=?', [id,id2]);
    req.flash('success', 'Estudiante expulsado correctamente');
    res.redirect('/estudiantes/'+id2);
});
//ver act estudiantes
router.get('/edit/:id/:id2/',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    const {id2} = req.params;
    const estudiantes = await pooldb.query('select * from users where id =?',[id]);
    const joinR = await pooldb.query('SELECT r.id,r.fk_id_usersE, u.fullname, r.fk_id_rimas ,rimas.title, r.intentos, r.score_rimas,cr.id as cursosRimas_id FROM users AS u INNER JOIN respuestas AS r ON u.id = r.fk_id_usersE INNER JOIN rimas AS rimas ON rimas.id = r.fk_id_rimas INNER JOIN cursosRimas as cr on cr.rimas_id = r.fk_id_rimas WHERE u.id = ? and cr.cursos_id=?', [id,id2]);
    const joinO = await  pooldb.query('SELECT r.id, r.fk_id_usersE, u.fullname, r.fk_id_oraciones ,o.title, r.score_oraciones, r.intentos,co.id as cursosOraciones FROM users AS u INNER JOIN respuestasO AS r ON u.id = r.fk_id_usersE INNER JOIN oraciones AS o ON o.id = r.fk_id_oraciones INNER JOIN cursosOraciones AS co ON co.oraciones_id = r.fk_id_oraciones WHERE u.id =? and co.cursos_id= ?', [id,id2]);
    const joinS = await  pooldb.query('SELECT s.id, s.fk_id_usersE, u.fullname, s.fk_id_signos ,o.title, s.score_signos, s.intentos, cs.id as cursosSignos FROM users AS u INNER JOIN respuestasS AS s ON u.id = s.fk_id_usersE INNER JOIN signos AS o ON o.id = s.fk_id_signos INNER JOIN cursosSignos AS cs ON cs.signos_id = s.fk_id_signos WHERE u.id = ? and cs.cursos_id = ?', [id,id2]);
    const joinU = await  pooldb.query('SELECT s.id, s.fk_id_usersE, u.fullname, s.fk_id_unir ,o.title, s.score_unir, s.intentos,cu.cursos_id FROM users AS u INNER JOIN respuestasU AS s ON u.id = s.fk_id_usersE INNER JOIN unir AS o ON o.id = s.fk_id_unir INNER JOIN cursosUnir AS cu ON cu.unir_id = s.fk_id_unir WHERE u.id = ? and cu.cursos_id=?', [id,id2]);
    res.render('estudiantes/edit', {estudiantes: estudiantes[0], joinO, joinR, joinS,joinU});
});
router.post('/edit/:id',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const {username,fullname,imagen,email,permisosList} = req.body;
    if (permisosList === "Docente")
    {
        const permisos = 1;
        const permisosAdmin = 0;
        const newLink = {
            username, fullname,imagen,email,permisos, permisosAdmin
        };
        await pooldb.query('update users set ? where id=?', [newLink, id]);
        req.flash('success', 'Estudiante editado correctamente');
        res.redirect('/estudiantes');
    }
    else if (permisosList === "Administrador")
    {
        const permisosAdmin = 1;
        const permisos = 0;
        const newLink = {
            username, fullname,imagen,email,permisos, permisosAdmin
        };
        await pooldb.query('update users set ? where id=?', [newLink, id]);
        req.flash('success', 'Estudiante editado correctamente');
        res.redirect('/estudiantes');
    }
    else {
        const permisosAdmin = 0;
        const permisos = 0;
        const newLink = {
            username, fullname,imagen,email,permisos, permisosAdmin
        };
        await pooldb.query('update users set ? where id=?', [newLink, id]);
        req.flash('success', 'Estudiante editado correctamente');
        res.redirect('/estudiantes');
    }
});
module.exports = router;