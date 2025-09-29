import { Component, signal } from '@angular/core';
import { MainService } from '../../services/main.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  protected form: FormGroup
  protected destinations = signal<string[]>([])

  constructor(private formBuilder: FormBuilder, protected router: Router) {
    MainService.getDestinations()
      .then(rsp => this.destinations.set(rsp.data))

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      repeat: ['', Validators.required],
      destination: ['', Validators.required]
    })
  }

  onSubmit() {
    if (!this.form.valid) {
      alert('Invalid form data!')
      return
    }

    if (this.form.value.password !== this.form.value.repeat) {
      alert(`Passwords don't match!`)
      return
    }

    try {
      const formValue: any = this.form.value
      delete formValue.repeat
      UserService.signup(formValue)
      this.router.navigateByUrl('/login')
    } catch (e) {
      console.error(e)
      alert('Data missing!')
    }
  }
}
