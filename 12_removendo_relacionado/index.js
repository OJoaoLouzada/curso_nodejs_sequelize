const express = require('express')
const exphbs = require('express-handlebars')


// Importa a conexão da pasta db
const conn = require('./db/conn')

// Importa os models
const User = require('./models/User')
const Address = require('./models/Address')

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

app.get('/users/:id', async (req, res) => {
  const id = req.params.id

  const user = await User.findOne({raw: true, where: {id: id}})

  res.render('userview', {user})
})

app.post('/users/delete/:id', async (req, res) => {
  const id = req.params.id

  await User.destroy({ where: {id: id} })

  res.redirect('/')
})

app.get('/users/edit/:id', async (req, res) => {
  const id = req.params.id

  const user = await User.findOne({include: Address, where: {id: id} })

  res.render('useredit', {user: user.get({plain: true})})
})

app.post('/users/update', async (req, res) => {
  const id = req.body.id
  const name = req.body.name
  const occupation = req.body.occupation
  let newsletter = req.body.newsletter

  if(newsletter === 'on') {
    newsletter = true
  } else {
    newsletter = false
  }

  const userData = {
    id,
    name,
    occupation,
    newsletter
  }

  await User.update(userData, {where: {id: id}})

  res.redirect('/')
})

app.post('/address/create', async (req, res) => {
  const UserId = req.body.UserId
  const street = req.body.street
  const number = req.body.number
  const city = req.body.city

  const address = {
    UserId,
    street,
    number,
    city
  }

  await Address.create(address)

  res.redirect(`/users/edit/${UserId}`)
})

app.post('/address/delete', async (req, res) => {
  const UserId = req.body.UserId
  const id = req.body.id
  await Address.destroy({where: {id: id}})

  res.redirect(`/users/edit/${UserId}`)
})


app.get('/', async (req, res) => {
  const users = await User.findAll({raw: true})

  res.render('home', {users: users})
})


// Sincroniza a aplicação a rodar somente se as tabelas necessárias forem criadas, através do método sync
conn
  .sync()
  // Esse atributo no sync força a recriação da tabela, apagando os dados e recriando-a. SÓ FAZ SENTIDO EM ALGUMAS SITUAÇÕES ESPECÍFICAS
  //.sync({force: true})
  .then(() => {
    app.listen(3000, () => {
      console.log('App rodando!')
    })
  })
.catch((err) => console.log(err))