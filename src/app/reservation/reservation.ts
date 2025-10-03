import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightModel } from '../../models/flight.model';
import { FlightService } from '../../services/flight.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Utils } from '../utils';

@Component({
  selector: 'app-reservation',
  imports: [ReactiveFormsModule],
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
      if (!localStorage.getItem('active')) {
        sessionStorage.setItem('ref', `/details/${params.id}/book`)
        router.navigateByUrl('/login')
        return
      }

      FlightService.getFlightById(params.id)
        .then(rsp => {
          this.flight.set(rsp.data)
          this.form = this.formBuilder.group({
            dest: new FormControl({ value: rsp.data.destination, disabled: true }),
            num: new FormControl({ value: rsp.data.flightNumber, disabled: true }),
            sch: new FormControl({ value: rsp.data.scheduledAt, disabled: true }),
            airline: [this.airlines[0], Validators.required],
            suite: [this.suites[0], Validators.required]
          })
        })
    })
  }

  onSubmit() {
    if (!this.form?.valid) {
      alert('Invalid form data!')
      return
    }

    if (this.flight() == null) {
      alert('Flight Not Loaded!')
      return
    }

    try {
      UserService.createReservation(this.flight()!.id, this.form.value.airline, this.form.value.suite)
      this.router.navigateByUrl('/profile')
    } catch {
      alert('Failed to make a reservation!')
    }
  }
}
