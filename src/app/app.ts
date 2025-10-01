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
  constructor(protected router: Router) { }

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
