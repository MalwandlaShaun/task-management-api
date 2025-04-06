import { FastifyInstance } from 'fastify'
import { build } from '../helper'
import sequelize from '../../src/config/database'
import { User } from '../../src/models/User'

let app: FastifyInstance

beforeAll(async () => {
    app = await build()
    await sequelize.sync({ force: true })
})

afterAll(async () => {
    await sequelize.close()
})

describe('Authentication API', () => {
    afterEach(async () => {
        await User.destroy({ where: {} })
    })

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/register',
                payload: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            })

            expect(response.statusCode).toBe(201)
            expect(JSON.parse(response.payload)).toHaveProperty('id')
            expect(JSON.parse(response.payload)).toHaveProperty('email', 'test@example.com')
        })

        it('should return 409 if email already exists', async () => {
            // Create a user first
            await app.inject({
                method: 'POST',
                url: '/api/auth/register',
                payload: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            })

            // Try to create the same user again
            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/register',
                payload: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            })

            expect(response.statusCode).toBe(409)
            expect(JSON.parse(response.payload)).toHaveProperty('error', 'Email already exists')
        })
    })

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create a user for login tests
            await app.inject({
                method: 'POST',
                url: '/api/auth/register',
                payload: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            })
        })

        it('should login a user with valid credentials', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/login',
                payload: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            })

            expect(response.statusCode).toBe(200)
            expect(JSON.parse(response.payload)).toHaveProperty('token')
        })

        it('should return 401 with invalid credentials', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/login',
                payload: {
                    email: 'test@example.com',
                    password: 'wrongpassword'
                }
            })

            expect(response.statusCode).toBe(401)
            expect(JSON.parse(response.payload)).toHaveProperty('error', 'Invalid email or password')
        })
    })
})