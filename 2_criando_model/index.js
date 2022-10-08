const express = require('express')
const exphbs = require('express-handlebars')


// Importa a conexão da pasta db
const conn = require('./db/conn')

// Importa os models
const User = require('./models/User')

const app = express()


// Configuração para pegar dados do body em json (req.body)
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())


// Configurando a engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

// Rotas

app.get('/', (req, res) => {
  res.render('home')
})


// Sincroniza a aplicação a rodar somente se as tabelas necessárias forem criadas, através do método sync
conn
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('App rodando!')
    })
  })
.catch((err) => console.log(err))