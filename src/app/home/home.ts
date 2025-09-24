import { Component, signal } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { QuestionModel } from '../../models/question.model';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected webData = signal<QuestionModel[]>([])
  protected webError = signal<any>(null)

  constructor() {
    QuestionService.getAllAdmissionQuestions()
      .then(rsp => this.webData.set(rsp.data))
      .catch(e => this.webError.set(e))
  }

}
