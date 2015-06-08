
module.exports = function( sequelize, DataTypes ) {
  return sequelize.define('Quiz', 
      { pregunta: {
                    type: DataTypes.STRING,
                    validate: { notEmpty: 
                        {msg: "El campo pregunta no puede estar en blanco" }}
                  },
        respuesta: {
                    type: DataTypes.STRING,
                    validate: { notEmpty: 
                        {msg: "El campo respuesta no puede estar en blanco" }}
                  },
        texto_respuesta: {
                    type: DataTypes.STRING,
                    validate: { notEmpty: 
                        {msg: "El campo texto_respuesta no puede estar en blanco" }}
                  },
        genero: {
                    type: DataTypes.STRING,
                    validate: { notEmpty: 
                        {msg: "El campo genero no puede estar en blanco" }}
                  }
      }
     );
}
