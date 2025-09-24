import { CategoryModel } from "./category.model"

export interface QuestionModel {
    questionId: number
    text: string
    answer: string
    intent: string
    createdAt: string
    updatedAt: string
    categoryId: number
    category: CategoryModel
}