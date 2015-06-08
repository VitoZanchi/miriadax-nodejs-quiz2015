
module.exports = function( sequelize, DataTypes ) {
  return sequelize.define('Quiz', 
      { pregunta: {
                    type: DataTypes.STRING,
                  },
        respuesta: {
                    type: DataTypes.STRING,
                  },
        texto_respuesta: {
                    type: DataTypes.STRING,
                  },
        genero:   {
                    type: DataTypes.STRING,
                  }
      }
     );
}
