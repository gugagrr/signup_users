const mongoose = require("mongoose"); //Import mongoose module 
const connect = mongoose.connect("mongodb://localhost:27017/Login-tut"); //Create a conection with DB

//Check DB connected or not
connect.then(() => {
    console.log("DB conectada com sucesso");
})
//Método CATCH
.catch(() => {
    console.log("DB não conectada");
});

//Criando esquema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true
    }
});

//collection Part - Create a model
//Dois parâmetros: nome da coleção e esquema
const collection = new mongoose.model("users", LoginSchema)

module.exports = collection; //Exporta o módulo
