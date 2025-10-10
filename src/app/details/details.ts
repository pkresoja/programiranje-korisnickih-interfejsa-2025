import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { FlightModel } from '../../models/flight.model';
import { Utils } from '../utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  imports: [RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details {
  protected flight = signal<FlightModel | null>(null)
  protected other = signal<FlightModel[]>([])

  constructor(private route: ActivatedRoute, protected utils: Utils) {
    this.utils.showLoading()
    this.route.params.subscribe((params: any) => {
      FlightService.getFlightById(params.id)
        .then(rsp => {
          this.flight.set(rsp.data)
          FlightService.getFlightsByDestination(rsp.data.destination)
          .then(rsp => {
            this.other.set(rsp.data.content)
            Swal.close()
          })
        })
    })
  }

  convertToString() {
    return JSON.stringify(this.flight(), null, 2)
  }
}
