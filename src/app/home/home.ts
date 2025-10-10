import { Component, signal } from '@angular/core';
import { FlightService } from '../../services/flight.service';
import { RouterLink } from '@angular/router';
import { FlightModel } from '../../models/flight.model';
import { Utils } from '../utils';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private static DESTINATION_KEY = 'pki_destination'
  private static FLIGHT_KEY = 'pki_flight'
  private static DEPARTURE_KEY = 'pki_departure'
  private static RATING_KEY = 'pki_rating'

  protected selectedDestination = this.loadValueFromLocalStorage(Home.DESTINATION_KEY)
  protected selectedFlightNumber = this.loadValueFromLocalStorage(Home.FLIGHT_KEY)
  protected selectedDepartureDate = this.loadValueFromLocalStorage(Home.DEPARTURE_KEY)
  protected selectedRating = this.loadValueFromLocalStorage(Home.RATING_KEY)

  protected allFlights = signal<FlightModel[]>([])
  protected flights = signal<FlightModel[]>([])

  constructor(protected utils: Utils) {
    this.utils.showLoading()
    UserService.loadRatingForDestination()
      .then(ratings => {
        FlightService.getFutureFlights()
          .then(rsp => {
            rsp.data.forEach(f => {
              if (ratings[f.destination.replaceAll(' ', '_')]) {
                f.rating = ratings[f.destination.replaceAll(' ', '_')]
              } else {
                f.rating = {
                  likes: 0,
                  dislikes: 0
                }
              }
            })
            this.allFlights.set(rsp.data)
            this.search()
            Swal.close()
          })
      })
  }

  protected getDestinations() {
    const arr = this.allFlights().map(f => f.destination)
    return [...new Set(arr)]
  }

  protected getFlightNumbers() {
    const arr = this.allFlights().map(f => f.flightNumber)
    return [...new Set(arr)]
  }

  protected getDepartureDates() {
    const arr = this.allFlights().map(f => f.scheduledAt.split('T')[0])
    return [...new Set(arr)]
  }

  protected search() {
    // Podesavamo vrednosti nazad svih select polja u local storage
    localStorage.setItem(Home.DESTINATION_KEY, this.selectedDestination)
    localStorage.setItem(Home.FLIGHT_KEY, this.selectedFlightNumber)
    localStorage.setItem(Home.DEPARTURE_KEY, this.selectedDepartureDate)
    localStorage.setItem(Home.RATING_KEY, this.selectedRating)

    this.flights.set(this.allFlights()
      .filter(f => {
        if (this.selectedDestination != 'all')
          return f.destination == this.selectedDestination
        return true
      })
      .filter(f => {
        if (this.selectedFlightNumber != 'all')
          return f.flightNumber == this.selectedFlightNumber
        return true
      })
      .filter(f => {
        if (this.selectedDepartureDate != 'all')
          return f.scheduledAt.split('T')[0] == this.selectedDepartureDate
        return true
      })
      .filter(f => {
        if (this.selectedRating == 'all')
          return true
        if (f.rating == undefined)
          return false
        if (f.rating.likes == 0 && f.rating.dislikes == 0)
          return false
        if (this.selectedRating == 'positive')
          return f.rating.likes >= f.rating.dislikes
        if (this.selectedRating == 'negative')
          return f.rating.dislikes > f.rating.likes
        return true
      })
    )
  }

  protected loadValueFromLocalStorage(key: string) {
    if (!localStorage.getItem(key))
      localStorage.setItem(key, 'all')

    return localStorage.getItem(key)!
  }
}
