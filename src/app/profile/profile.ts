import { Component, signal } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ReservationModel } from '../../models/reservation.model';
import { Utils } from '../utils';
import { FlightModel } from '../../models/flight.model';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  protected currentUser = signal<UserModel | null>(null)
  protected flights = signal<FlightModel[]>([])

  constructor(private router: Router, public utils: Utils) {
    try {
      this.currentUser.set(UserService.getActiveUser())
      FlightService.getFlightsByIds(this.currentUser()!.data.map(r => r.flightId))
        .then(rsp => this.flights.set(rsp.data))
    } catch {
      // Nema aktivnog korisnika
      // Idi na login
      this.router.navigate(['/login'])
    }
  }

  protected pay(r: ReservationModel) {
    UserService.updateReservationStatus(r.createdAt, 'paid')
    this.currentUser.set(UserService.getActiveUser())
  }

  protected cancel(r: ReservationModel) {
    UserService.updateReservationStatus(r.createdAt, 'canceled')
    this.currentUser.set(UserService.getActiveUser())
  }

  protected like(r: ReservationModel) {
    UserService.updateReservationStatus(r.createdAt, 'liked')
    this.currentUser.set(UserService.getActiveUser())
  }

  protected dislike(r: ReservationModel) {
    UserService.updateReservationStatus(r.createdAt, 'disliked')
    this.currentUser.set(UserService.getActiveUser())
  }

  protected getFlight(r: ReservationModel) {
    return this.flights().find(f => f.id === r.flightId)
  }
}
