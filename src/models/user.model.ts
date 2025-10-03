import { ReservationModel } from "./reservation.model";

export interface UserModel {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    destination: string,
    data: ReservationModel[]
}