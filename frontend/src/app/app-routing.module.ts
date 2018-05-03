import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PrivacyComponent} from './privacy/privacy.component';
import {EventComponent} from './event/event.component';
import {NavItem} from './sidenav/nav-item';
import {ExportComponent} from './export/export.component';
import {AuthGuardService} from './auth/guards/auth-guard.service';
import {LocationResolverService} from './location/service/location-resolver.service';
import {UsersResolverService} from './user/service/users-resolver.service';
import {QuestionResolverService} from './questions/service/question-resolver.service';
import {ReportsComponent} from './reports/reports.component';
import {AboutComponent} from './about/about.component';
import {LocationComponent} from './location/location.component';
import {LocationEditComponent} from './location-edit/location-edit.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {UserByEmailResolverService} from './user/service/user-by-email-resolver.service';
import {EventGuardService} from './auth/guards/event-guard.service';
import {AdminGuardService} from './auth/guards/admin-guard.service';
import {UserComponent} from './user/user.component';
import {RoleResolverService} from './role/service/role-resolver.service';
import {NotFoundComponent} from './not-found/not-found.component';
import {UsersByEmailResolverService} from './user/service/users-by-email-resolver.service';

/**
 * The actual available routes. Which links are routed to which components.
 */
const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'privacy', component: PrivacyComponent},
    {path: 'about', component: AboutComponent},
    {path: 'error', component: NotFoundComponent},
    {
        path: 'event',
        component: EventComponent,
        canActivate: [EventGuardService],
        resolve: {
            locationResolver: LocationResolverService,
            usersResolver: UsersResolverService,
            questionResolver: QuestionResolverService,
            userByEmailResolver: UsersByEmailResolverService
        }
    },
    {path: 'reports', component: ReportsComponent, canActivate: [AuthGuardService]},
    {path: 'export', component: ExportComponent, canActivate: [AuthGuardService]},
    {
        path: 'locations',
        component: LocationComponent,
        canActivate: [AuthGuardService],
        resolve: {
            locationResolver: LocationResolverService
        }
    },
    {
        path: 'locations/create',
        component: LocationEditComponent,
        canActivate: [AuthGuardService],
        resolve: {
            locationResolver: LocationResolverService
        }
    },
    {
        path: 'locations/:id/edit',
        component: LocationEditComponent,
        canActivate: [AuthGuardService],
        resolve: {
            locationResolver: LocationResolverService
        }
    },
    {path: 'reports', component: ReportsComponent, canActivate: [AdminGuardService]},
    {path: 'export', component: ExportComponent, canActivate: [AdminGuardService]},
    {path: 'dashboard', redirectTo: 'reports', pathMatch: 'full', canActivate: [AdminGuardService]}, // a protected page
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password/:email/:resetToken', component: ResetPasswordComponent},
    // todo: route route to dashboard when made
    {path: 'users',
        component: UserComponent,
        resolve: {
            usersResolver: UsersResolverService,
            rolesResolver: RoleResolverService
        }
    },
    {path: '', redirectTo: 'reports', pathMatch: 'full'},
    {path: '**', redirectTo: 'error', pathMatch: 'full'}
];

/**
 * Displayed in the side nav bar. Leaving future navItems commented out.
 * TODO: Uncomment relevant navItem when a new page is created.
 */
export const NAV_ITEMS_ADMIN: NavItem[] = [
    // new NavItem('Dashboard', '/dashboard'),
    new NavItem('Reports', '/reports'),
    new NavItem('Observe', '/event'),
    new NavItem('Privacy', '/privacy'),
    new NavItem('About', '/about'),
    // new NavItem('Help', '/help'),
    NavItem.createNavItemWithSubItems('Settings', [
        // new NavItem('Account', '/account'),
        // new NavItem('Notifications', '/notifications'),
        // new NavItem('Sensors', '/sensors'),
        // new NavItem('RFIDs', '/rfids'),
        new NavItem('Locations', '/locations'),
        new NavItem('Users', '/users'),
        new NavItem('Export All Observations', '/export')
    ])
];

export const NAV_ITEMS_OBSERVER: NavItem[] = [
    new NavItem('Observe', '/event'),
    new NavItem('Privacy', '/privacy'),
    new NavItem('About', '/about'),
    // new NavItem('Help', '/help'),
    // NavItem.createNavItemWithSubItems('Settings', [
        // new NavItem('Account', '/account'),
    // ])
];

export const NAV_ITEMS_USER: NavItem[] = [
    new NavItem('Privacy', '/privacy'),
    new NavItem('About', '/about')
    // new NavItem('Help', '/help'),
    // NavItem.createNavItemWithSubItems('Settings', [
        // new NavItem('Account', '/account'),
    // ])
];

export const NAV_ITEMS_ANY: NavItem[] = [
    new NavItem('Login', '/login'),
    new NavItem('Privacy', '/privacy'),
    new NavItem('About', '/about')
    // new NavItem('Help', '/help'),
    // NavItem.createNavItemWithSubItems('Settings', [
    // new NavItem('Account', '/account'),
    // ])
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes)],
    providers: [
        QuestionResolverService,
        UsersResolverService,
        LocationResolverService,
        UserByEmailResolverService,
        RoleResolverService
    ]
})
export class AppRoutingModule {
}

