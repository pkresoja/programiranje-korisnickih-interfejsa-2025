import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { FlightModel } from '../../models/flight.model';
import { Utils } from '../utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details {
  protected flight = signal<FlightModel | null>(null)

  constructor(private route: ActivatedRoute, protected utils: Utils) {
    this.utils.showLoading()
    this.route.params.subscribe((params: any) => {
      FlightService.getFlightById(params.id)
        .then(rsp => {
          this.flight.set(rsp.data)
          Swal.close()
        })
    })
  }

  convertToString() {
    return JSON.stringify(this.flight(), null, 2)
  }
}
