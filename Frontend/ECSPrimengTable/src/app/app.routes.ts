import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NavigationDemoScope, NavigationDemoDetail, NavigationDemoOther } from './pages/home/navigation-demo';

export const routes: Routes = [
    { path: 'home', component: NavigationDemoScope, children: [
        { path: '', pathMatch: 'full', component: Home },
        { path: ':id/edit', component: NavigationDemoDetail }
    ] },
    { path: 'other', component: NavigationDemoOther },

    // FALLBACK
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];