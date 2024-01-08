-- --------------------------V4F copy paste en mysql---------------------------
drop database if exists codyeduDB;
CREATE  DATABASE codyeduDB;
USE codyeduDB;
-- users tab (Docentes)
create  table users(
                       id int(11) not null ,
                       username varchar(16) not null ,
                       password varchar(60) not null ,
                       fullname varchar(100) not null,
                       permisos boolean not null
);

alter table users
    add primary key (id);
alter table users
    modify id int(11) not null auto_increment, auto_increment=2;
ALTER TABLE users ADD imagen TEXT;
ALTER TABLE users ADD email varchar(100) not null;
ALTER TABLE users ADD token varchar(10);
ALTER TABLE users ADD permisosAdmin boolean not null;
ALTER TABLE users MODIFY COLUMN imagen varchar(500) NOT NULL DEFAULT 'https://images7.alphacoders.com/116/thumb-1920-1168618.jpg';
alter table users add lastaccess timestamp not null default current_timestamp;
-- update users set permisosAdmin=1 where id=22;
-- select * from users;
-- select lastaccess from users where id=21
-- delete from users where id =30;
-- alter table users drop createdat;

-- SELECT u.*,ca.*,c.* FROM cursosAlumnos AS ca INNER JOIN cursos AS c ON ca.cursos_id = c.id INNER JOIN users as u on u.id=ca.users_id where ca.cursos_id=1;






-- select u.*,ca.cursos_id from cursosAlumnos as ca inner join users as u on ca.users_id = u.id where u.id=21
-- select e.*,ce.cursos_id from edu as e inner join cursosEdu as ce on e.id=ce.edu_id where createdat<current_time() and cursos_id=1






-- cursos tabs
drop table if exists cursos;
create table cursos(
	id int(11) primary key not null auto_increment,
    title varchar(150) not null,
	description TEXT,
	user_id int (11) not null,
    token varchar(10) not null,
	createdat timestamp not null default current_timestamp,
    constraint fk_user_cursos foreign key (user_id) references users(id)
);
-- select * from cursos;
-- SELECT r.*,o.*,s.*,u.*,c.*,cr.*,co.*,cs.*,cu.* FROM rimas AS r INNER JOIN cursosRimas AS cr ON r.id = cr.rimas_id
-- INNER JOIN cursosOraciones AS co ON co.cursos_id = cr.cursos_id INNER JOIN oraciones AS o ON co.oraciones_id = o.id
-- INNER JOIN cursosSignos AS cs ON cs.cursos_id = cr.cursos_id INNER JOIN signos AS s ON cs.signos_id = s.id
-- INNER JOIN cursosUnir AS cu ON cu.cursos_id = cr.cursos_id INNER JOIN unir AS u ON cu.unir_id = u.id
-- INNER JOIN cursos AS c ON cu.cursos_id = c.id;
-- select * from cursos where id = 1

create table cursosAlumnos(
	id int(11) primary key not null auto_increment,
    users_id int(11) not null,
    cursos_id int(11) not null,
    constraint fk_cursos_cursosAlumnos foreign key (cursos_id) references cursos(id),
    constraint fk_users_cursos foreign key (users_id) references users(id)
);
ALTER TABLE cursosAlumnos ADD createdat timestamp not null default current_timestamp;
-- select u.username,ca.cursos_id,count(c.user_id) from cursosAlumnos as ca inner join users as u on ca.users_id = u.id inner join cursos as c on c.id= ca.cursos_id where c.user_id=24;
-- select * from cursosAlumnos;
-- select * from cursosAlumnos where users_id=21 and cursos_id=1;
-- SELECT COUNT(*) FROM cursosAlumnos where users_id=21;
-- select u.*,ca.cursos_id from cursosAlumnos as ca inner join users as u on ca.users_id = u.id where u.id=21;
-- select e.*,ce.cursos_id from edu as e inner join cursosEdu as ce on e.id=ce.edu_id where createdat<current_time() and cursos_id=1
-- select ca.*, u.id from cursosAlumnos as ca inner join users as u on ca.users_id = u.id where u.id=21;
-- SELECT ca.* FROM cursos AS c INNER JOIN cursosAlumnos AS ca ON c.id = ca.cursos_id where token='JOMv_OKs' and users_id=21;
-- select  ca.*,c.* FROM cursosAlumnos AS ca INNER JOIN cursos AS c ON ca.cursos_id = c.id where cursos_id=4;

drop table if exists passToken;
create table passToken(
	id int(10) primary key not null auto_increment,
    token varchar(10) not null,
    expires DATETIME not null,
    user_id int(11) not null,
    constraint fk_userToken foreign key (user_id) references users(id)
);
-- delete from passToken;
-- select * from passToken;
-- DELETE FROM passToken WHERE user_id=13
-- select * from passToken where token = 'O4C-ApT1';
-- SELECT u.id, u.email, t.user_id FROM users AS u INNER JOIN passToken AS t ON u.id = user_id WHERE u.id =13;

-- edu tab
create table edu(
                    id int(11) not null,
                    title varchar(150) not null ,
                    url varchar(255) not null ,
                    description TEXT,
                    user_id int(11),
                    createdat timestamp not null default current_timestamp,
                    constraint fk_user foreign key (user_id) references users(id)
);
alter table edu modify id int(11) primary key auto_increment,auto_increment=2;
ALTER TABLE edu ADD imagen text;
-- UPDATE users SET imagen = 'https://i.etsystatic.com/19028598/r/il/cfe254/2784477135/il_794xN.2784477135_skv5.jpg' WHERE id = 2;
ALTER TABLE edu MODIFY COLUMN imagen varchar(250) NOT NULL DEFAULT '/gallery/default.png';
-- select * from edu where id =8;
-- describe edu;

create table rimas(
                      id int(11) not null primary key  auto_increment,
                      title varchar(100) not null,
                      description TEXT,
                      frase1 varchar(150) not null,
                      frase2 varchar(150) not null,
                      frase3 varchar(150) not null,
                      correct1 varchar(50) not null,
                      correct2 varchar(50) not null,
                      correct3 varchar(50) not null,
                      incorrect1 varchar(50) not null,
                      incorrect2 varchar(50) not null,
                      incorrect3 varchar(50) not null,
                      imagen1 text,
                      imagen2 text,
                      imagen3 text,
                      createdat timestamp not null default current_timestamp,
                      fk_user_id int(11) not null,
                      foreign key (fk_user_id) references users(id)
);
ALTER TABLE rimas ADD incorrect4 varchar(150) not null;
ALTER TABLE rimas ADD incorrect5 varchar(150) not null;
ALTER TABLE rimas ADD incorrect6 varchar(150) not null;
ALTER TABLE rimas ADD incorrect7 varchar(150) not null;
ALTER TABLE rimas ADD incorrect8 varchar(150) not null;
ALTER TABLE rimas ADD incorrect9 varchar(150) not null;
-- describe rimas;
-- select * from rimas
-- SELECT r.id,r.fk_id_usersE, u.fullname, r.fk_id_rimas ,rimas.title, r.intentos, r.score_rimas,cr.id as cursosRimas_id FROM users AS u INNER JOIN respuestas AS r ON u.id = r.fk_id_usersE INNER JOIN rimas AS rimas ON rimas.id = r.fk_id_rimas INNER JOIN cursosRimas as cr on cr.rimas_id = r.fk_id_rimas WHERE u.id = 21;
/*SELECT rimas.title,u.fullname,r.id,r.fk_id_usersE, r.fk_id_rimas , r.intentos, r.score_rimas,cr.id as cursosRimas_id FROM rimas AS rimas 
INNER JOIN cursosRimas as cr on cr.rimas_id = rimas.id left join respuestas AS r ON rimas.id = r.fk_id_rimas 
left join users as u ON u.id = r.fk_id_usersE
WHERE u.id = 31
INNER JOIN respuestas AS r ON u.id = r.fk_id_usersE */



-- select r.id,r.title,,cr.id as cursosRimas from rimas as r INNER JOIN cursosRimas as cr on cr.rimas_id=r.id INNER JOIN respuestas as res on res.fk_id_rimas=r.id
drop table if exists respuestas;
create table respuestas (
                            id int(10) primary key not null auto_increment,
                            fk_id_usersE int(11) not null,
                            fk_id_rimas int(11) not null,
                            score_rimas int(2) not null ,
                            intentos int(3) not null,
                            FOREIGN KEY (fk_id_rimas) REFERENCES rimas(id),
                            FOREIGN KEY (fk_id_usersE) REFERENCES users(id)
);
ALTER TABLE respuestas MODIFY COLUMN intentos int(3) NOT NULL DEFAULT 0;
ALTER TABLE respuestas ADD createdat timestamp not null default current_timestamp;
-- select * from respuestas;
 -- select * from cursosRimas;
-- select * from respuestas where fk_id_usersE = 21 and fk_id_rimas=23;
-- drop table rimas;
create table oraciones(
                      id int(11) not null primary key  auto_increment,
                      title varchar(100) not null,
                      description TEXT,
                      frase1 varchar(150) not null,
                      frase2 varchar(150) not null,
                      frase3 varchar(150) not null,
                      correct1 varchar(50) not null,
                      correct2 varchar(50) not null,
                      correct3 varchar(50) not null,
                      incorrect1 varchar(50) not null,
                      incorrect2 varchar(50) not null,
                      incorrect3 varchar(50) not null,
                      imagen1 text,
                      imagen2 text,
                      imagen3 text,
                      createdat timestamp not null default current_timestamp,
                      fk_user_id int(11) not null,
                      foreign key (fk_user_id) references users(id)
);
ALTER TABLE oraciones ADD incorrect4 varchar(150) not null;
ALTER TABLE oraciones ADD incorrect5 varchar(150) not null;
ALTER TABLE oraciones ADD incorrect6 varchar(150) not null;
ALTER TABLE oraciones ADD incorrect7 varchar(150) not null;
ALTER TABLE oraciones ADD incorrect8 varchar(150) not null;
ALTER TABLE oraciones ADD incorrect9 varchar(150) not null;
-- alter table rimas modify id int(11) primary key auto_increment,auto_increment=2;
-- describe rimas;
-- SELECT r.id, r.fk_id_usersE, u.fullname, r.fk_id_oraciones ,o.title, r.score_oraciones, r.intentos,co.id as cursosOraciones FROM users AS u INNER JOIN respuestasO AS r ON u.id = r.fk_id_usersE INNER JOIN oraciones AS o ON o.id = r.fk_id_oraciones INNER JOIN cursosOraciones AS co ON co.oraciones_id = r.fk_id_oraciones WHERE u.id = 21
-- select * from oraciones;

create table respuestasO (
                            id int(10) primary key not null auto_increment,
                            fk_id_usersE int(11) not null,
                            fk_id_oraciones int(11) not null,
                            score_oraciones int(2) not null ,
                            intentos int(3) not null,
                            FOREIGN KEY (fk_id_oraciones) REFERENCES oraciones(id),
                            FOREIGN KEY (fk_id_usersE) REFERENCES users(id)
);
ALTER TABLE respuestasO MODIFY COLUMN intentos int(3) NOT NULL DEFAULT 0;
ALTER TABLE respuestasO ADD createdat timestamp not null default current_timestamp;
-- SELECT co.oraciones_id,o.createdat,c.title,count(c.user_id) as numCount FROM cursosOraciones AS co INNER JOIN respuestasO AS o ON o.fk_id_oraciones = co.oraciones_id INNER JOIN cursos as c on c.id=co.cursos_id where c.user_id=24 and o.createdat > current_time()
-- select * from respuestasO;
-- select * from users;
-- select * from respuestasO where fk_id_usersE = 21 and fk_id_oraciones=9
-- SELECT r.id,r.fk_id_usersE, u.fullname, r.fk_id_oraciones ,o.title, r.intentos, r.score_oraciones FROM users AS u INNER JOIN respuestasO AS r ON u.id = r.fk_id_usersE INNER JOIN oraciones AS o ON o.id = r.fk_id_oraciones WHERE u.id = 3
-- SELECT r.id,r.fk_id_usersE, u.fullname, r.fk_id_rimas ,rimas.title, r.intentos, r.score_rimas FROM users AS u INNER JOIN respuestas AS r ON u.id = r.fk_id_usersE INNER JOIN rimas AS rimas ON rimas.id = r.fk_id_rimas WHERE u.id = 3

drop table if exists signos;
create table signos(
                      id int(11) not null primary key  auto_increment,
                      title varchar(100) not null,
                      description TEXT,
                      frase1 varchar(150) not null,
                      frase2 varchar(150) not null,
                      frase3 varchar(150) not null,
                      correct1 varchar(5) not null,
                      correct2 varchar(5) not null,
                      correct3 varchar(5) not null,
                      incorrect1 varchar(5) not null,
                      incorrect2 varchar(5) not null,
                      incorrect3 varchar(5) not null,
                      imagen1 text,
                      imagen2 text,
                      imagen3 text,
                      createdat timestamp not null default current_timestamp,
                      fk_user_id int(11) not null,
                      foreign key (fk_user_id) references users(id)
);
-- select * from signos;
-- SELECT s.id, s.fk_id_usersE, u.fullname, s.fk_id_signos ,o.title, s.score_signos, s.intentos, cs.id as cursosSignos FROM users AS u INNER JOIN respuestasS AS s ON u.id = s.fk_id_usersE INNER JOIN signos AS o ON o.id = s.fk_id_signos INNER JOIN cursosSignos AS cs ON cs.signos_id = s.fk_id_signos WHERE u.id = 

drop table if exists respuestasS;
create table respuestasS (
                            id int(10) primary key not null auto_increment,
                            fk_id_usersE int(11) not null,
                            fk_id_signos int(11) not null,
                            score_signos int(2) not null ,
                            intentos int(3) not null,
                            FOREIGN KEY (fk_id_signos) REFERENCES signos(id),
                            FOREIGN KEY (fk_id_usersE) REFERENCES users(id)
);
ALTER TABLE respuestasS ADD createdat timestamp not null default current_timestamp;
-- select * from respuestasS;
-- SELECT s.id, s.fk_id_usersE, u.fullname, s.fk_id_signos ,o.title, s.score_signos, s.intentos FROM users AS u INNER JOIN respuestasS AS s ON u.id = s.fk_id_usersE INNER JOIN signos AS o ON o.id = s.fk_id_signos WHERE u.id = 21
drop table if exists unir;
create table unir(
                      id int(11) not null primary key  auto_increment,
                      title varchar(100) not null,
                      description TEXT,
                      palabra1 varchar(150) not null,
                      palabra2 varchar(150) not null,
                      palabra3 varchar(150) not null,
                      imagen1 text,
                      imagen2 text,
                      imagen3 text,
                      createdat timestamp not null default current_timestamp,
                      fk_user_id int(11) not null,
                      foreign key (fk_user_id) references users(id)
);
ALTER TABLE unir ADD incorrect1 varchar(150) not null;
ALTER TABLE unir ADD incorrect2 varchar(150) not null;
ALTER TABLE unir ADD incorrect3 varchar(150) not null;
select * from unir;
-- SELECT u.*, cu.* FROM unir AS u INNER JOIN cursosUnir AS cu ON u.id = cu.unir_id where cursos_id=1;
-- SELECT s.id, s.fk_id_usersE, u.fullname, s.fk_id_unir ,o.title, s.score_unir, s.intentos,cu.cursos_id  FROM users AS u INNER JOIN respuestasU AS s ON u.id = s.fk_id_usersE INNER JOIN unir AS o ON o.id = s.fk_id_unir INNER JOIN cursosUnir AS cu ON cu.unir_id = s.fk_id_unir WHERE u.id = ?
-- SELECT u.*, ru.* FROM unir AS u INNER JOIN respuestasU AS ru ON u.id = ru.fk_id_unir wh


drop table if exists respuestasU;
create table respuestasU (
                            id int(10) primary key not null auto_increment,
                            fk_id_usersE int(11) not null,
                            fk_id_unir int(11) not null,
                            score_unir int(2) not null ,
                            intentos int(3) not null,
                            FOREIGN KEY (fk_id_unir) REFERENCES unir(id),
                            FOREIGN KEY (fk_id_usersE) REFERENCES users(id)
);
ALTER TABLE respuestasU ADD createdat timestamp not null default current_timestamp;
-- SELECT s.id, s.fk_id_usersE, u.fullname, s.fk_id_unir ,o.title, s.score_unir, s.intentos FROM users AS u INNER JOIN respuestasU AS s ON u.id = s.fk_id_usersE INNER JOIN unir AS o ON o.id = s.fk_id_unir WHERE u.id = 21
-- select * from respuestasU;
drop table if exists cursosEdu;
create table cursosEdu(
	id int(11) primary key not null auto_increment,
    edu_id int(11) not null,
    cursos_id int(11) not null,
    constraint fk_cursos_cursosEdu foreign key (cursos_id) references cursos(id),
    constraint fk_edu_cursos foreign key (edu_id) references edu(id)
);
-- SELECT e.*, ce.* FROM edu AS e INNER JOIN cursosEdu AS ce ON e.id = ce.edu_id where cursos_id=4


drop table if exists cursosRimas;
create table cursosRimas(
	id int(11) primary key not null auto_increment,
	rimas_id int(11) not null,
    cursos_id int(11) not null,
    constraint fk_cursos_cursosRimas foreign key (cursos_id) references cursos(id),
    constraint fk_rimas_cursos foreign key (rimas_id) references rimas(id)
);
-- select c.title,cr.cursos_id from cursos as c inner join cursosRimas as cr on c.id=cr.cursos_id where createdat<current_time() and cursos_id=1
-- select * from cursosRimas where cursos_id=8;
-- SET FOREIGN_KEY_CHECKS=0; -- to disable them
-- SET FOREIGN_KEY_CHECKS=1; -- to re-enable them
-- SELECT r.*, cr.*,rr.* FROM rimas AS r INNER JOIN cursosRimas AS cr ON r.id = cr.rimas_id INNER JOIN respuestas AS rr ON rr.fk_id_rimas=r.id where fk_id_usersE=21 and cursos_id=1
-- select cr.*,rr.* FROM respuestas AS rr INNER JOIN cursosRimas AS cr ON rr.fk_id_rimas = cr.rimas_id
 -- SELECT cr.*,rr.* FROM respuestas AS rr INNER JOIN cursosRimas AS cr ON rr.fk_id_rimas = cr.rimas_id ;
  -- select rr.* FROM respuestas as rr INNER JOIN cursosRimas as cr ON rr.fk_id_rimas = cr.rimas_id WHERE  fk_id_usersE=21 and cursos_id=1
-- delete r.*, cr.*,rr.* FROM rimas AS r INNER JOIN cursosRimas AS cr ON r.id = cr.rimas_id INNER JOIN respuestas AS rr ON rr.fk_id_rimas=r.id where cursos_id=4;
-- delete  cr.*,r.*,rr.* FROM cursosRimas AS cr INNER JOIN respuestas AS rr ON rr.fk_id_rimas = cr.rimas_id INNER JOIN rimas AS r ON r.id=rr.fk_id_rimas where cursos_id=4;
-- SELECT r.*, cr.* FROM rimas AS r INNER JOIN cursosRimas AS cr ON r.id = cr.rimas_id where cursos_id=4;

drop table if exists cursosOraciones;
create table cursosOraciones(
	id int(11) primary key not null auto_increment,
    oraciones_id int(11) not null,
    cursos_id int(11) not null,
    constraint fk_cursos_cursosOraciones foreign key (cursos_id) references cursos(id),
    constraint fk_oraciones_cursos foreign key (oraciones_id) references oraciones(id)
);
-- SELECT o.id, c.id,co.id,o.title FROM oraciones AS o INNER JOIN cursosOraciones AS co ON o.id = co.oraciones_id INNER JOIN cursos AS c ON c.id = co.cursos_id;
-- select  cr.*,r.*,rr.* FROM cursosOraciones AS cr INNER JOIN respuestasO AS rr ON rr.fk_id_oraciones = cr.oraciones_id INNER JOIN oraciones AS r ON r.id=rr.fk_id_oraciones where cursos_id=4;
-- SELECT r.*, cr.* FROM oraciones AS r INNER JOIN cursosOraciones AS cr ON r.id = cr.oraciones_id where cursos_id=4;

drop table if exists cursosSignos;
create table cursosSignos(
	id int(11) primary key not null auto_increment,
    signos_id int(11) not null,
    cursos_id int(11) not null,
    constraint fk_cursos_cursosSignos foreign key (cursos_id) references cursos(id),
    constraint fk_signos_cursos foreign key (signos_id) references signos(id)
);
-- SELECT s.id, c.id,co.id,s.title FROM signos AS s INNER JOIN cursosSignos AS co ON s.id = co.signos_id INNER JOIN cursos AS c ON c.id = co.cursos_id;
-- select  cr.*,r.*,rr.* FROM cursosSignos AS cr INNER JOIN respuestasS AS rr ON rr.fk_id_signos = cr.signos_id INNER JOIN signos AS r ON r.id=rr.fk_id_signos where cursos_id=4;
-- SELECT r.*, cr.* FROM signos AS r INNER JOIN cursosSignos AS cr ON r.id = cr.signos_id where cursos_id=4;

drop table if exists cursosUnir;
create table cursosUnir(
	id int(11) primary key not null auto_increment,
    unir_id int(11) not null,
    cursos_id int(11) not null,
    constraint fk_cursos_cursosUnir foreign key (cursos_id) references cursos(id),
    constraint fk_unir_cursos foreign key (unir_id) references unir(id)
);
-- select * from cursosUnir;
-- SELECT s.id, c.id,co.id,s.title FROM unir AS s INNER JOIN cursosUnir AS co ON s.id = co.unir_id INNER JOIN cursos AS c ON c.id = co.cursos_id;
-- select  cr.*,r.*,rr.* FROM cursosUnir AS cr INNER JOIN respuestasU AS rr ON rr.fk_id_unir = cr.unir_id INNER JOIN unir AS r ON r.id=rr.fk_id_unir where cursos_id=4;
-- SELECT r.*, cr.* FROM unir AS r INNER JOIN cursosUnir AS cr ON r.id = cr.unir_id where cursos_id=4;

