import { Component, signal } from '@angular/core';
import { FlightService } from '../../services/flight.service';
import { RouterLink } from '@angular/router';
import { FlightModel } from '../../models/flight.model';
import { Utils } from '../utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected flights = signal<FlightModel[]>([])

  constructor(protected utils: Utils) {
    this.utils.showLoading()
    FlightService.getFutureFlights()
      .then(rsp => {
        this.flights.set(rsp.data)
        Swal.close()
      })
  }  
}
