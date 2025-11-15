import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { UserForm } from './pages/user-form/user-form';
import { SignIn } from './pages/sign-in/sign-in';
import { ListProducts } from './pages/list-products/list-products';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'user-form', component: UserForm},
    {path: 'sign-in', component: SignIn},
    {path: 'list-products', component: ListProducts},
    {path: '**', redirectTo: ''}
];
