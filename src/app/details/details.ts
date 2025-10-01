import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { FlightModel } from '../../models/flight.model';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details {
  protected flight = signal<FlightModel | null>(null)

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params: any) => {
      FlightService.getFlightById(params.id)
        .then(rsp => this.flight.set(rsp.data))
    })
  }

  convertToString() {
    return JSON.stringify(this.flight(), null, 2)
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
