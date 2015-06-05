
module.exports = function( sequelize, DataTypes ) {
  return sequelize.define('Quiz', 
      { pregunta: DataTypes.STRING,
        respuesta: DataTypes.STRING,
        texto_respuesta: DataTypes.STRING } );
}
