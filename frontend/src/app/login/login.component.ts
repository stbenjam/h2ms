import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {ConfigService} from '../config/config.service';
import {Config} from '../config/config';
import {UserEmailService} from '../user/service/user-email.service';
import {
    REQUIRED_EMAIL,
    REQUIRED_EMAIL_ERROR_MESSAGE,
    REQUIRED_PASSWORD,
    REQUIRED_PASSWORD_ERROR_MESSAGE
} from '../forms-common/form-controls';
import {FormControl} from '@angular/forms';
import {UserRoleService} from '../user/service/user-role.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', '../card.css']
})
export class LoginComponent implements OnInit {

    emailFormControl: FormControl = REQUIRED_EMAIL;
    emailErrorMessage = REQUIRED_EMAIL_ERROR_MESSAGE;
    passwordFormControl: FormControl = REQUIRED_PASSWORD;
    passwordErrorMessage = REQUIRED_PASSWORD_ERROR_MESSAGE;
    hide = true;
    loginAttempts = 2;
    config: Config;

    constructor(private auth: AuthService,
                private router: Router,
                private configService: ConfigService,
                private userEmailService: UserEmailService,
                private userRoleService: UserRoleService,
                private route: ActivatedRouteSnapshot,
                private state: RouterStateSnapshot) {
        this.config = configService.getConfig();
    }

    ngOnInit() {
        this.auth.logout();
    }

    submit(email: string, password: string): void {
        if (this.emailFormControl.invalid) {
            console.log('Submit sent when email was invalid.');
            return;
        } else if (this.passwordFormControl.invalid) {
            console.log('Submit sent when password was invalid.');
            return;
        }

        this.auth.login(email, password)
            .subscribe(
                response => {
                    this.userEmailService.setEmail(email);
                    if (this.userRoleService.hasRoles(['ROLE_ADMIN'], this.route, this.state)) {
                        this.router.navigate(['dashboard']);
                    } else if (this.userRoleService.hasRoles(['ROLE_OBSERVER'], this.route, this.state)) {
                        this.router.navigate(['event']);
                    } else {
                        this.router.navigate(['about']);
                    }
                },
                error => {
                    if (error.status === 401) {
                        alert('login failed');
                        this.loginAttempts--;
                        if (this.loginAttempts === 0) {
                            this.router.navigate(['password-recovery']);
                        }
                    }
                });
    }
}
