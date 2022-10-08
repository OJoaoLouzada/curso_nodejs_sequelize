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

app.get('/users/create', (req, res) => {
  res.render('adduser')
})

app.post('/users/create', async (req, res) => { // async e await servem para esperar inserir os dados antes de redirecionar
  const name = req.body.name
  const occupation = req.body.occupation
  let newsletter = req.body.newsletter

  // O valor da checkbox vem por padrão "on", então mudamos isso:
  if(newsletter === 'on') {
    newsletter = true
  } else {
    newsletter = false
  }
  // Inserindo os dados na tabela
  await User.create({name, occupation, newsletter})

  res.redirect('/')
})

app.get('/', async (req, res) => {
  const users = await User.findAll({raw: true})

  res.render('home', {users: users})
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