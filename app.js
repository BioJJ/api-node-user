const express = require('express')
const fs = require('fs')
const app = express()


//esta linha é necessária para analisar o corpo da solicitação
app.use(express.json())
/* create user*/
app.post('/user/add', (req, res) => {
    //obter os dados existentes do usuário
    const existUsers = getUserData()
    
    //obter os novos dados do usuário na pós-solicitação
    const userData = req.body
    //verifique se os campos userData estão faltando
    if (userData.fullname == null || userData.age == null || userData.username == null || userData.password == null) {
        return res.status(401).send({error: true, msg: 'User data missing'})
    }
    
    //verifique se o nome de usuário já existe
    const findExist = existUsers.find( user => user.username === userData.username )
    if (findExist) {
        return res.status(409).send({error: true, msg: 'username already exist'})
    }
    //anexar os dados do usuário
    existUsers.push(userData)
    //salvar os novos dados do usuário
    saveUserData(existUsers);
    res.send({success: true, msg: 'User data added successfully'})
})

/* Listar usuarios*/
app.get('/user/list', (req, res) => {
    const users = getUserData()
    res.send(users)
})

/* Atualizar usuarios */
app.patch('/user/update/:username', (req, res) => {
    //get the username from url
    const username = req.params.username
    //obter os dados de atualização
    const userData = req.body
    //obter os dados existentes do usuário
    const existUsers = getUserData()

    //verifique se o nome de usuário existe ou não      
    const findExist = existUsers.find( user => user.username === username )
    if (!findExist) {
        return res.status(409).send({error: true, msg: 'username not exist'})
    }
    //filtrar os dados do usuário
    const updateUser = existUsers.filter( user => user.username !== username )

    //enviar os dados atualizados
    updateUser.push(userData)

    //finalmente salvar o usuario atualizado
    saveUserData(updateUser)
    res.send({success: true, msg: 'User data updated successfully'})
})
/* Deletar usuario */
app.delete('/user/delete/:username', (req, res) => {
    const username = req.params.username
    //obter os dados de usuário existentes
    const existUsers = getUserData()
    //filtrar os dados do usuário para removê-los
    const filterUser = existUsers.filter( user => user.username !== username )
    if ( existUsers.length === filterUser.length ) {
        return res.status(409).send({error: true, msg: 'username does not exist'})
    }
    //salvar os dados filtrados
    saveUserData(filterUser)
    res.send({success: true, msg: 'User removed successfully'})
    
})


/* util functions */
//ler os dados do usuário do arquivo json
const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('users.json', stringifyData)
}
//obter os dados do usuário do arquivo json
const getUserData = () => {
    const jsonData = fs.readFileSync('users.json')
    return JSON.parse(jsonData)    
}
/* Funções do servidor */
//configurar a porta do servidor
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})