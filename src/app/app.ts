import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected currentUser = signal<string | null>(null)
  constructor(protected router: Router) {
    this.currentUser.set(localStorage.getItem(UserService.ACTIVE_KEY))
  }

  hasAuth() {
    if (localStorage.getItem(UserService.ACTIVE_KEY))
      return true
    return false
  }

  logoutNow() {
    if (!confirm('Logout now?')) return
    UserService.logout()
    this.router.navigateByUrl('/login')
  }
}
