import { Component, signal } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ReservationModel } from '../../models/reservation.model';
import { Utils } from '../utils';
import { FlightModel } from '../../models/flight.model';
import { FlightService } from '../../services/flight.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  protected profileForm: FormGroup
  protected passwordForm: FormGroup
  protected currentUser = signal<UserModel | null>(null)
  protected flights = signal<FlightModel[]>([])
  protected destinations = signal<string[]>([])

  constructor(private formBuilder: FormBuilder, private router: Router, public utils: Utils) {
    try {
      this.utils.showLoading()
      this.currentUser.set(UserService.getActiveUser())
    } catch {
      // Nema aktivnog korisnika
      // Idi na login
      this.router.navigate(['/login'])
    }

    this.profileForm = this.formBuilder.group({
      firstName: [this.currentUser()!.firstName, Validators.required],
      lastName: [this.currentUser()!.lastName, Validators.required],
      phone: [this.currentUser()!.phone, Validators.required],
      destination: [this.currentUser()!.destination, Validators.required]
    })

    this.passwordForm = this.formBuilder.group({
      current: ['', Validators.required],
      new: ['', Validators.required],
      repeat: ['', Validators.required]
    })

    FlightService.getFlightsByIds(this.currentUser()!.data.map(r => r.flightId))
      .then(rsp => {
        this.flights.set(rsp.data)
        Swal.close()
      })

    FlightService.getDestinations()
      .then(rsp => {
        this.destinations.set(rsp.data)
      })
  }

  protected pay(r: ReservationModel) {
    this.utils.showConfirm('Are you sure you want to pay for the reservation?', () => {
      UserService.updateReservationStatus(r.createdAt, 'paid')
      this.currentUser.set(UserService.getActiveUser())
    })
  }

  protected cancel(r: ReservationModel) {
    this.utils.showConfirm('Are you sure you want to cancel the reservation?', () => {
      UserService.updateReservationStatus(r.createdAt, 'canceled')
      this.currentUser.set(UserService.getActiveUser())
    })
  }

  protected like(r: ReservationModel) {
    this.utils.showConfirm('Are you sure you want to leave a positive review?', () => {
      UserService.updateReservationStatus(r.createdAt, 'liked')
      this.currentUser.set(UserService.getActiveUser())
    })
  }

  protected dislike(r: ReservationModel) {
    this.utils.showConfirm('Are you sure you want to leave a negative review?', () => {
      UserService.updateReservationStatus(r.createdAt, 'disliked')
      this.currentUser.set(UserService.getActiveUser())
    })
  }

  protected getFlight(r: ReservationModel) {
    return this.flights().find(f => f.id === r.flightId)
  }

  protected onProfileSubmit() {
    this.utils.showConfirm('Are you sure you want to update your profile?', () => {
      if (!this.profileForm.valid) {
        this.utils.showError('Invalid form data')
        return
      }

      UserService.updateUser(this.profileForm.value)
      this.utils.showAlert('Profile has been updated!')
    })
  }

  protected onPasswordSubmit() {
    this.utils.showConfirm('Are you sure you want to change your password?', () => {
      if (!this.passwordForm.valid) {
        this.utils.showError('Invalid password form data')
        return
      }

      const old = this.currentUser()!.password
      if (old != this.passwordForm.value.current) {
        this.utils.showError('Incorrect current password')
        return
      }

      if (this.passwordForm.value.new != this.passwordForm.value.repeat) {
        this.utils.showError("New passwords don't match!")
        return
      }

      UserService.updateUserPassword(this.passwordForm.value.new)
      this.utils.showAlert("Password has been changed! You will be redirected to the login page.")
      UserService.logout()
      this.router.navigateByUrl('/login')
    })
  }
}
