import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ConfigService} from './config/config.service';
import {Config} from './config/config';
import {NavItem} from './sidenav/nav-item';
import {NAV_ITEMS_ADMIN, NAV_ITEMS_OBSERVER, NAV_ITEMS_USER} from './app-routing.module';
import {Location} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {AuthService} from './auth/auth.service';
import {UserRoleService} from './user/service/user-role.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

/**
 * Main component for the App. The Navbar is based on this example:
 * https://stackblitz.com/angular/ngjvmobekyl?file=app%2Fsidenav-responsive-example.css
 */
export class AppComponent implements OnDestroy, OnChanges {
    mobileQuery: MediaQueryList;
    config: Config;
    navItems: NavItem[];

    private _mobileQueryListener: () => void;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private media: MediaMatcher,
                private location: Location,
                private configService: ConfigService,
                private titleService: Title,
                private authService: AuthService,
                private userRoleService: UserRoleService,
                private route: ActivatedRouteSnapshot,
                private state: RouterStateSnapshot) {
        this.mobileQuery = media.matchMedia('(max-width: 1050px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.config = configService.getConfig();
        this.navItems = NAV_ITEMS_USER;
        for (const navItem of this.navItems) {
            navItem.showSubItems = navItem.isCurrentlySelected(location.path());
        }
        this.setTitle(this.config.appName);
    }

    ngOnChanges() {
        if (this.authService.isLoggedIn()) {
            if (this.userRoleService.hasRoles(['ROLE_ADMIN'], this.route, this.state)) {
                this.setNavItems(NAV_ITEMS_ADMIN);
            } else if (this.userRoleService.hasRoles(['ROLE_OBSERVER'], this.route, this.state)) {
                this.setNavItems(NAV_ITEMS_OBSERVER);
            } else {
                this.setNavItems(NAV_ITEMS_USER);
            }
        }
    }

    isInProduction() {
        return window.location.hostname === 'h2ms.org';
    }

    isSidebarOpenOnPageLoad() {
        return this.location.path() !== '/login' && !this.isMobileResolution();
    }

    private isMobileResolution() {
        return this.mobileQuery.matches;
    }

    switchConfigFile() {
        this.configService.toggleConfig();
        this.setTitle(this.config.appName);
    }

    /**
     * todo: move to app module
     */
    public setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }


    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    public setNavItems(newNavItems: NavItem[]) {
        this.navItems = newNavItems;
        for (const navItem of this.navItems) {
            navItem.showSubItems = navItem.isCurrentlySelected(this.location.path());
        }
    }

}
