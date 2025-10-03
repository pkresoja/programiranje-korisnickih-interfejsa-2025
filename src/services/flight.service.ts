import axios from "axios";
import { FlightModel } from "../models/flight.model";

const client = axios.create({
    baseURL: 'https://flight.pequla.com/api',
    validateStatus: (status: number) => status === 200,
    headers: {
        'Accept': 'application/json',
        'X-Name': 'PKI/2025'
    }
})

export class FlightService {
    static async getFutureFlights() {
        return await client.get<FlightModel[]>('/flight/list?type=departure')
    }

    static async getFlightById(id: number) {
        return await client.get<FlightModel>(`/flight/${id}`)
    }

    static async getFlightsByIds(ids: number[]) {
        return await client.request({
            url: '/flight/list',
            method: 'post',
            data: ids
        })
    }
}