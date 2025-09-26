import { Component, signal } from '@angular/core';
import { QuestionModel } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';
import linkifyHtml from "linkify-html"
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question',
  imports: [FormsModule],
  templateUrl: './question.html',
  styleUrl: './question.css'
})
export class Question {
  protected webData = signal<QuestionModel[]>([])
  protected webError = signal<any>(null)
  protected search: string = ''
  protected previousSearch: string = 'N/A'

  constructor() {
    this.loadQuestions()
  }

  loadQuestions() {
    if (this.previousSearch == '' && this.search == '') return
    this.previousSearch = this.search
    QuestionService.getAllAdmissionQuestions(this.search)
      .then(rsp => this.webData.set(rsp.data))
      .catch(e => this.webError.set(e))
  }

  convertToLinks(text: string) {
    return linkifyHtml(text)
  }
}
