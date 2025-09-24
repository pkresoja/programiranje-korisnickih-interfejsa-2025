import axios from "axios";
import { QuestionModel } from "../models/question.model";

const client = axios.create({
    baseURL: 'https://rasa.singidunum.ac.rs/api/question',
    validateStatus: (status: number) => status === 200,
    headers: {
        'Accept': 'application/json',
        'X-Name': 'PKI/2025',
        'X-Token': '70b58a3d-4771-4092-8d01-2dcd08e5ad90'
    }
})

export class QuestionService {
    static async getAllAdmissionQuestions() {
        return await client.get<QuestionModel[]>('/category/upis')
    }
}