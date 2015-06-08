var path = require("path");

var Sequelize = require("sequelize");

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6] || null);
var user     = (url[2] || null);
var pwd      = (url[3] || null);
var protocol = (url[1] || null);
var dialect  = (url[1] || null);
var port     = (url[5] || null);
var host     = (url[4] || null);
var storage  = process.env.DATABASE_STORAGE;

var sequelize = new Sequelize( DB_name, user, pwd,
    { 
      dialect: protocol,
      protocol: protocol,
      port: port,
      host: host,
      storage: storage,
      omitNull: true
    } 
    );

var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz;

// Creacion de tablas y carga inicial de datos en la BBDD:
sequelize.sync().then( function() {

  Quiz.count().then( function(count) {
    if( count == 0 ) {
      Quiz.create( 
        { pregunta: '¿Capital de Italia?',
          respuesta: '^Roma$',
          texto_respuesta: 'Roma',
          genero: 'Humanidades'
        })
        Quiz.create( 
        { pregunta: '¿Capital de Portugal?',
          respuesta: '^Lisboa$',
          texto_respuesta: 'Lisboa',
          genero: 'Humanidades'
        })
        Quiz.create( 
        { pregunta: '¿Cómo se llama el satélite de la Tierra?',
          respuesta: '^(la )?luna$',
          texto_respuesta: 'Luna',
          genero: 'Ciencia'
        })
      .then( function() { console.log("BBDD inicializada."); });
    }
  });
});

