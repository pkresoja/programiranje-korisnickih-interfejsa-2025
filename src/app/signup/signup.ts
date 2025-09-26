import { Component, signal } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-signup',
  imports: [],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  protected destinations = signal<string[]>([])

  constructor() {
    MainService.getDestinations()
      .then(rsp => this.destinations.set(rsp.data))
  }
}
