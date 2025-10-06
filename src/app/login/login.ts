import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { Utils } from '../utils';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  protected form: FormGroup

  constructor(private formBuilder: FormBuilder, protected router: Router, private utils: Utils) {
    this.form = this.formBuilder.group({
      email: ['user@example.com', [Validators.required, Validators.email]],
      password: ['user123', Validators.required]
    })
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utils.showError('Invalid form data!')
      return
    }

    try {
      UserService.login(this.form.value.email, this.form.value.password)
      const url = sessionStorage.getItem('ref') ?? '/profile'
      sessionStorage.removeItem('ref')
      this.router.navigateByUrl(url)
    } catch (e) {
      this.utils.showError('Check your login params!')
    }
  }
}
