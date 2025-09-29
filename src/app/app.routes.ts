import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Question } from './question/question';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Profile } from './profile/profile';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'about', component: About },
    { path: 'question', component: Question },
    { path: 'profile', component: Profile },
    { path: '**', redirectTo: '' }
]
