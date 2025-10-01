import axios from "axios";

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
        return await client.get('/flight/list?type=departure')
    }

    static async getFlightById(id: number) {
        return await client.get(`/flight/${id}`)
    }
}