import { UserModel } from "../models/user.model"

export class UserService {
    static getUsers(): UserModel[] {
        if (!localStorage.getItem('users'))
            localStorage.setItem('users', JSON.stringify([
                {
                    firstName: 'Example',
                    lastName: 'User',
                    email: 'user@example.com',
                    phone: '+38163123123',
                    password: 'user123',
                    destination: 'Zagreb',
                    data: []
                }
            ]))
        return JSON.parse(localStorage.getItem('users')!)
    }

    static findUserByEmail(email: string) {
        const users: UserModel[] = this.getUsers()
        const exactUser = users.find(u => u.email === email)

        if (!exactUser)
            throw new Error('USER_NOT_FOUND')

        return exactUser
    }

    static login(email: string, password: string) {
        const user = this.findUserByEmail(email)
        if (user.password !== password) {
            throw new Error('BAD_CREDENTIALS')
        }

        localStorage.setItem('active', user.email)
    }

    static signup(payload: UserModel) {
        const users: UserModel[] = this.getUsers()
        users.push(payload)
        localStorage.setItem('users', JSON.stringify(users))
    }

    static getActiveUser() {
        const active = localStorage.getItem('active')
        if (!active)
            throw new Error('NO_ACTIVE_USER')

        return this.findUserByEmail(active)
    }

    static createReservation(id: number, airline: string, suite: string) {
        const active = this.getActiveUser()
        const users = this.getUsers()
        users.forEach(u => {
            if (u.email == active.email) {
                u.data.push({
                    flightId: id,
                    airline,
                    suite,
                    status: 'waiting',
                    createdAt: new Date().toISOString(),
                    updatedAt: null
                })
            }
        })
        localStorage.setItem('users', JSON.stringify(users))
    }

    static updateReservationStatus(createdAt: string, newStatus: 'paid' | 'waiting' | 'canceled' | 'liked' | 'disliked') {
        const active = this.getActiveUser()
        const users = this.getUsers()
        users.forEach(u => {
            if (u.email == active.email) {
                u.data.forEach(r => {
                    if (r.createdAt == createdAt) {
                        r.updatedAt = new Date().toISOString()
                        r.status = newStatus
                    }
                })
            }
        })
        localStorage.setItem('users', JSON.stringify(users))
    }

    static updateUser(newUser: UserModel) {
        const active = this.getActiveUser()
        const users = this.getUsers()
        users.forEach(u => {
            if (u.email == active.email) {
                u.firstName = newUser.firstName
                u.lastName = newUser.lastName
                u.phone = newUser.phone
                u.destination = newUser.destination
            }
        })
        localStorage.setItem('users', JSON.stringify(users))
    }

    static logout() {
        localStorage.removeItem('active')
    }
}