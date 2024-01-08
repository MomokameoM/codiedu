const {format} = require('timeago.js');

const  helpers = {};
// covierte el timestamp de la BD a formato bonito
helpers.timeago = (TIMESTAMP)=>{
    return  format(TIMESTAMP);
};

module.exports = helpers;