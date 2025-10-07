import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected currentUser = signal<UserModel | null>(null)
  constructor(protected router: Router) {
    this.currentUser.set(UserService.getActiveUser())
  }

  hasAuth() {
    if (localStorage.getItem('active'))
      return true
    return false
  }

  logoutNow() {
    if (!confirm('Logout now?')) return
    UserService.logout()
    this.router.navigateByUrl('/login')
  }
}
