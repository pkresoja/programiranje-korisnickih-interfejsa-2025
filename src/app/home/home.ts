import { Component, signal } from '@angular/core';
import { FlightService } from '../../services/flight.service';
import { RouterLink } from '@angular/router';
import { FlightModel } from '../../models/flight.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected flights = signal<FlightModel[]>([])

  constructor() {
    FlightService.getFutureFlights()
      .then(rsp => this.flights.set(rsp.data))
  }

  protected formatDate(iso: string) {
    return new Date(iso).toLocaleString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  protected getImage(dest: string) {
    return `https://img.pequla.com/destination/${dest.split(' ')[0].toLowerCase()}.jpg`
  }
}
