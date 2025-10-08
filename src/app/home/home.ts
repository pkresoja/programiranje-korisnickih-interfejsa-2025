import { Component, signal } from '@angular/core';
import { FlightService } from '../../services/flight.service';
import { RouterLink } from '@angular/router';
import { FlightModel } from '../../models/flight.model';
import { Utils } from '../utils';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';

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
    UserService.loadRatingForDestination()
      .then(ratings => {
        FlightService.getFutureFlights()
          .then(rsp => {
            rsp.data.forEach(f => {
              if (ratings[f.destination.replaceAll(' ', '')]) {
                f.rating = ratings[f.destination.replaceAll(' ', '')]
              } else {
                f.rating = {
                  likes: 0,
                  dislikes: 0
                }
              }
            })
            console.log(rsp.data)
            this.flights.set(rsp.data)
            Swal.close()
          })
      })
  }
}
