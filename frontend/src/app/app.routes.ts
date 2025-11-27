import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { UserForm } from './pages/user-form/user-form';
import { SignIn } from './pages/sign-in/sign-in';
import { ListProducts } from './pages/list-products/list-products';
import { ProductDetails } from './pages/product-details/product-details';
import { authGuardGuard } from './auth/guards/auth-guard-guard';
import { UserProfile } from './pages/user-profile/user-profile';
import { SellerDash } from './pages/seller-dash/seller-dash';
import { Cart } from './pages/cart/cart';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'sign-up', component: UserForm, title:"Registrarse"},
    {path: 'sign-in', component: SignIn, title:"Acceder"},
    {path: 'list-products', component: ListProducts},
    {path: 'product-detail/:id', component: ProductDetails},
    {path: 'profile/:id', component: UserProfile, canActivate: [authGuardGuard], title:"Mi Perfil"},
    {path: ':id/offers', component: ListProducts, canActivate: [authGuardGuard], title:"Mis ofertas"},
    {path: ':id/purchases', component: ListProducts, canActivate: [authGuardGuard], title:"Mis Compras"},
    {path: ':id/seller-dash', component: SellerDash, canActivate: [authGuardGuard], title: "Dashboard"},
    {path: ':id/dashboard', component: ListProducts, canActivate: [authGuardGuard], title:"Mis ofertas"},
    {path: ':id/cart', component: Cart, canActivate: [authGuardGuard], title:"Carrito de Compras"},
    {path: '**', redirectTo: ''}
];
