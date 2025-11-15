import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { UserForm } from './pages/user-form/user-form';
import { SignIn } from './pages/sign-in/sign-in';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'sign-up', component: UserForm, title:"Registrarse"},
    {path: 'sign-in', component: SignIn, title:"Acceder"},
    {path: '**', redirectTo: ''}
];
