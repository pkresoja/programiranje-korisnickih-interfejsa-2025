import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Question } from './question/question';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Profile } from './profile/profile';
import { Details } from './details/details';
import { Reservation } from './reservation/reservation';

export const routes: Routes = [
    { path: '', title: 'Home', component: Home },
    { path: 'login', title: 'Login', component: Login },
    { path: 'signup', title: 'Signup', component: Signup },
    { path: 'about', title: 'About', component: About },
    { path: 'question', title: 'Questions', component: Question },
    { path: 'profile', title: 'User Profile', component: Profile },
    { path: 'details/:id/book', title: 'Book Now', component: Reservation },
    { path: 'details/:id', title: 'Details', component: Details },
    { path: '**', redirectTo: '' }
]
