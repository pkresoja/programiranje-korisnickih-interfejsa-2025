import { FlightModel } from "../models/flight.model"
import { ReservationModel } from "../models/reservation.model"
import { UserModel } from "../models/user.model"
import { FlightService } from "./flight.service"

export class UserService {
    public static USERS_KEY = 'pki_users'
    public static ACTIVE_KEY = 'pki_active'

    static getUsers(): UserModel[] {
        if (!localStorage.getItem(UserService.USERS_KEY))
            localStorage.setItem(UserService.USERS_KEY, JSON.stringify([
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
        return JSON.parse(localStorage.getItem(UserService.USERS_KEY)!)
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

        localStorage.setItem(UserService.ACTIVE_KEY, user.email)
    }

    static signup(payload: UserModel) {
        const users: UserModel[] = this.getUsers()
        users.push(payload)
        localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users))
    }

    static getActiveUser() {
        const active = localStorage.getItem(UserService.ACTIVE_KEY)
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
        localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users))
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
        localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users))
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
        localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users))
    }

    static updateUserPassword(newPassword: string) {
        const active = this.getActiveUser()
        const users = this.getUsers()
        users.forEach(u => {
            if (u.email == active.email) {
                u.password = newPassword
            }
        })
        localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users))
    }

    static async loadRatingForDestination() {
        const reservations: ReservationModel[] = []

        // Grupisemo sve rezervacije svih korisnika
        // u jedan zajednicki niz
        for (let u of this.getUsers()) {
            reservations.push(...u.data)
        }

        // Ucitavamo sve detalje letova za sve rezervacije
        let ratings: any = {}
        const rsp = await FlightService.getFlightsByIds(reservations.map(r => r.flightId))
        for (let f of rsp.data) {
            for (let r of reservations) {
                if (f.id == r.flightId) {
                    const destinationName = f.destination.replaceAll(' ', '_')

                    // Proveri da li je ta destinacija (destinationName) ikada definisana
                    // I ako nije onda joj podesi pocetne vrednosti za broj lajkova i dislajkova
                    if (ratings[destinationName] == undefined) {
                        ratings[destinationName] = {
                            likes: 0,
                            dislikes: 0
                        }
                    }

                    // Ako je lakovano povecaj za 1 lakove
                    if (r.status == 'liked') {
                        ratings[destinationName].likes++
                    }

                    // Ako je dislajkovano povecaj za jedan dislakove
                    if (r.status == 'disliked') {
                        ratings[destinationName].dislikes++
                    }
                }
            }
        }

        return ratings
    }

    static logout() {
        localStorage.removeItem(UserService.ACTIVE_KEY)
    }
}