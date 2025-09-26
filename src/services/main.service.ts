import axios from "axios";

export class MainService {
    static async getDestinations() {
        return await axios.get<string[]>('./destinations.json')
    }
}