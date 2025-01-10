import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        pathMatch: 'full',
        loadComponent: () => import('../app/auth/pages/log-in/log-in.component').then(m => m.LogInComponent)
    },
    {
        path: 'sign-up',
        loadComponent: () => import('../app/auth/pages/sign-up/sign-up.component').then(m => m.SignUpComponent)
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'login'
    }
];
