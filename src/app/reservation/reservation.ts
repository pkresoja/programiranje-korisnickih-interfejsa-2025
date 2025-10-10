import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlightModel } from '../../models/flight.model';
import { FlightService } from '../../services/flight.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Utils } from '../utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservation',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reservation.html',
  styleUrl: './reservation.css'
})
export class Reservation {
  protected flight = signal<FlightModel | null>(null)
  protected airlines: string[] = ['Air Serbia', 'Fly Emirates', 'Air France']
  protected suites: string[] = ['Economy', 'Buissines', 'First Class']
  protected form: FormGroup | undefined

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    protected utils: Utils
  ) {
    this.route.params.subscribe((params: any) => {
      // Provera da li smo ulogovani
      if (!localStorage.getItem(UserService.ACTIVE_KEY)) {
        sessionStorage.setItem('ref', `/details/${params.id}/book`)
        router.navigateByUrl('/login')
        return
      }

      this.utils.showLoading()
      FlightService.getFlightById(params.id)
        .then(rsp => {
          this.flight.set(rsp.data)
          this.form = this.formBuilder.group({
            dest: new FormControl({ value: rsp.data.destination, disabled: true }),
            num: new FormControl({ value: rsp.data.flightNumber, disabled: true }),
            sch: new FormControl({ value: utils.formatDate(rsp.data.scheduledAt), disabled: true }),
            airline: [this.airlines[0], Validators.required],
            suite: [this.suites[0], Validators.required]
          })
          Swal.close()
        })
    })
  }

  onSubmit() {
    if (!this.form?.valid) {
      this.utils.showError('Invalid form data!')
      return
    }

    if (this.flight() == null) {
      this.utils.showError('Flight not loaded!')
      return
    }

    this.utils.showConfirm('Are you sure you want to make a reservation?', () => {
      try {
        UserService.createReservation(this.flight()!.id, this.form!.value.airline, this.form!.value.suite)
        this.router.navigateByUrl('/profile')
      } catch {
        this.utils.showError('Failed to make a reservation!')
      }
    })
  }
}
