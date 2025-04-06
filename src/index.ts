import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import dotenv from 'dotenv'
import sequelize from './config/database'
import routes from './routes'

// Load environment variables
dotenv.config()

const server = fastify({
    logger: process.env.NODE_ENV === 'development'
})

// Register plugins
server.register(fastifyCors)
server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key'
})

// Register routes
server.register(routes)

// Start the server
const start = async (): Promise<void> => {
    try {
        // Connect to the database and sync models
        await sequelize.authenticate()
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' })

        console.log('Database connection has been established successfully.')

        await server.listen({
            port: parseInt(process.env.PORT || '3000'),
            host: '0.0.0.0'
        })

        console.log(`Server is running on port ${process.env.PORT || 3000}`)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()