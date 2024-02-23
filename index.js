/*
const express = require("express") //Importação com ferramenta express
const app = express() //esta é uma aplicação que vai utilizar express
const port = 3000 //é a porta que vai executar a aplicação

app.get('/',(req,res)=>{
    //Quando aplicação receber uma requisição do tipo GET na rota <barra />
    //Executa essa função
    res.send('Página Teste') //Envia a resposta <frase>
})
//A aplicação fica escutando a porta 3000
app.listen(port,()=>{
    //CONSOLE.LOG para verificação se está executando
    console.log('Servidor executando na porta 3000')
})


npm install express
npm install mongoose
npm install bcrypt
npm install ejs

*/

const express = require("express"); //Importa express module
const pasth = require("path"); //Interage com o system file
const bcrypt = require("bcrypt");
const collection = require("./config"); //Importa o módulo criado no config.js

const app = express(); //Cria uma aplicação express

//Converter os dados em formato JSON. Usar método app use
app.use(express.json());

//Uso do express URL encoded method
app.use(express.urlencoded({ extended: false }));


//Usando EJS como view engine
app.set('view engine', 'ejs');
//Arquivo estático
app.use(express.static("public"))

//Usa método APP GET
app.get("/", (req, res) => { //Usa um root no 1º parâmetro e função callback no 2º
    // res.send("login_test")
    res.render("login"); //Para o pagina de login
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

//Register User
app.post("/signup", async (req, res) => { //Define um callback

    const data = { //Cria um objeto pelo qual é enviada por meio do forms signup
        name: req.body.username,
        password: req.body.password
    }

    //Verificar se o usuário já existe
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send("Usuário já existe. Por favor escolha um nome de usuário diferente.");
    } else {
        //Código de HASH das senhas cadastradas usadno BCRYPT
        const saltRounds = 10; //Número saltRounds fro bcrypt
        //Converte a password em uma hashedPassword
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; //Replace the hash password with original password

        const userdata = await collection.insertMany(data); //Codigo pare enviar este dado para a DB
        console.log(userdata); //Mostrar no terminal para checar os tipos de dados que podemos enviar    
        
    }
    /*    
        const userdata = await collection.insertMany(data); //Codigo pare enviar este dado para a DB
        console.log(userdata); //Mostrar no terminal para checar os tipos de dados que podemos enviar
    */


});

//Login user
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("Usuário não encontrado.");
        }
        //Compara a hashPassword da DB com a plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render("home");
        } else {
            req.send("Senha incorreta!");
        }
    } catch {
        res.send("Vish... Alguma coisa está errada aí");
    }
});

const port = 3000; //escolhe a porta onde vai executar a aplicação
app.listen(port, () => {
    console.log('Servidor executando na Porta: 3000')
})
