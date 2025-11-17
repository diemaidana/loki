import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { UserForm } from './pages/user-form/user-form';
import { SignIn } from './pages/sign-in/sign-in';
import { ListProducts } from './pages/list-products/list-products';
import { ProductDetails } from './pages/product-details/product-details';
import { authGuardGuard } from './auth/guards/auth-guard-guard';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'sign-up', component: UserForm, title:"Registrarse"},
    {path: 'sign-in', component: SignIn, title:"Acceder"},
    {path: 'list-products', component: ListProducts},
    {path: 'product-detail/:id', component: ProductDetails, canActivate: [authGuardGuard]},
    {path: '**', redirectTo: ''}
];
