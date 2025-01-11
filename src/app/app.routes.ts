import { Routes } from '@angular/router';
import { authGuardGuard } from './auth/guards/auth-guard.guard';

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
        path: 'post-page',
        pathMatch: 'full',
        loadComponent: () => import('../app/post/pages/post-page/post-page.component').then(m => m.PostPageComponent),
        canActivate: [authGuardGuard],
        data: { roles: ['USER'] }
    },
    {
        path: 'create-post',
        pathMatch: 'full',
        loadComponent: () => import('../app/post/pages/create-post-page/create-post-page.component').then(m => m.CreatePostPageComponent),
        canActivate: [authGuardGuard],
        data: { roles: ['USER'] }
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'login'
    }
];
