const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const axios = require('axios')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const PORT = process.env.PORT || 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    socket.on('getRepositories', async (username) => {
        try {
            const response = await axios.get(`https://api.github.com/users/${username}/repos`)
            const repositories = response.data.map((repo) => ({
                name: repo.name,
                url: repo.html_url,
            }))
            socket.emit('repositories', repositories)
        } catch (error) {
            console.error(error)
        }
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})