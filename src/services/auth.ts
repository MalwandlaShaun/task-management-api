import bcrypt from 'bcrypt'
import { User } from '../models/User'

export interface RegisterData {
    email: string
    password: string
}

export interface LoginData {
    email: string
    password: string
}

export async function register (data: RegisterData): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    return await User.create({
        email: data.email,
        password: hashedPassword
    })
}

export async function login (data: LoginData): Promise<User | null> {
    const user = await User.findOne({ where: { email: data.email } })

    if (!user) {
        return null
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password)

    if (!passwordMatch) {
        return null
    }

    return user
}