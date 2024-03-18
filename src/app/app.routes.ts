import { Routes } from '@angular/router';

import { HomeComponent, AboutUsComponent, BibliographyComponent } from './features/home';
import { ViewerComponent } from './features/data-viewer';

export const routes: Routes = [
    { path: '', component: HomeComponent, },
    { path: 'about-us', component: AboutUsComponent, },
    { path: 'bibliography', component: BibliographyComponent, },
    { path: 'viewer', component: ViewerComponent, },
];
