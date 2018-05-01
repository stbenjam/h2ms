import {Component, OnInit} from '@angular/core';
import {ResourcesRole, ResourcesUser, ResourceUser, Role, User, UserEntityService} from '../';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {FormSubmissionDialogComponent} from '../dynamic-form/dynamic-form.component';
import {DIALOG_STYLE} from '../forms-common/dialog';
import {MatCheckboxChange, MatDialog, MatDialogRef} from '@angular/material';
import {UserRegistrationService} from '../api/registration.service';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['../card.css']
})
export class UserComponent implements OnInit {
    userForm: FormGroup;
    users: Array<ResourceUser>;
    roles: Array<Role>;
    editMode: boolean;
    user: User;
    isLoggedIn = false;
    selectedRoles: Array<any>;

    constructor(private actr: ActivatedRoute,
                private userEntityService: UserEntityService,
                private userRegistrationService: UserRegistrationService,
                private authService: AuthService,
                private http: HttpClient,
                public dialog: MatDialog) { }

    ngOnInit() {

        this.isLoggedIn = this.authService.isLoggedIn();
        this.selectedRoles = [];

        this.userForm = new FormGroup({
            userSelect: new FormControl(),
            firstName: new FormControl('', [
                Validators.required
            ]),
            middleName: new FormControl(),
            lastName: new FormControl('', [
                Validators.required
            ]),
            email: new FormControl('', [
                Validators.required,
                Validators.email
            ]),
            type: new FormControl('', [
                Validators.required
            ])
        });

        const rolesResolver = this.actr.snapshot.data.rolesResolver;
        if (rolesResolver._embedded && rolesResolver._embedded.roles.length > 0) {
            this.roles = rolesResolver._embedded.roles;
            this.roles.forEach((role) => {
                this.userForm.addControl((role.id).toString(10), new FormControl());
            });
        }

        const usersResolver = this.actr.snapshot.data.usersResolver;
        if (usersResolver._embedded && usersResolver._embedded.users.length > 0) {
            this.users = usersResolver._embedded.users.filter((resourceUser: ResourceUser) => {
                return resourceUser.enabled;
            });
            this.users.sort(this.compareUsers);
        }
    }

    onSubmit() {
        let saveObservable;

        this.user = {
            firstName: this.userForm.get('firstName').value,
            lastName: this.userForm.get('lastName').value,
            email: this.userForm.get('email').value,
            type: this.userForm.get('type').value,
        };

        if (this.isLoggedIn) {
            this.user.roles = [];
            this.selectedRoles.forEach((role) => {
                // DEVELOPER NOTE: The code below is to be used if the API accepts a role object as part of the body in a PATCH
                // As of now, HATEOS forces us to send the URI for the roles instead during a PATCH
                if (!this.editMode) {
                    const roleToAdd = {
                        id: role.id,
                        name: role.name
                    };
                    this.user.roles.push(roleToAdd);
                } else {
                    // user links for PATCH (edits)
                    this.user.roles.push(role._links.self.href);
                }
            });
        }

        if (this.userForm.get('middleName').value) {
            this.user.middleName = this.userForm.get('middleName').value;
        }

        if (this.editMode) {
            this.user.id = this.userForm.get('userSelect').value.id;
        }

        // If this is a logged in user, use the admin save methods
        if (this.authService.isLoggedIn()) {
            saveObservable = this.editMode ? this.userEntityService.saveUserUsingPATCH(this.user.id, this.user)
                : this.userRegistrationService.saveNewUserUsingPOST(this.user);
        } else {
            // else use the registration path
            saveObservable = this.userRegistrationService.saveNewUserUsingPOST(this.user);
        }

        saveObservable.subscribe((response) => {
            this.openSuccessDialog();
            if (this.authService.isLoggedIn()) {
                this.userEntityService.findAllUserUsingGET(undefined, '50', undefined).subscribe((res) => {
                    this.users = res._embedded.users.filter((resourceUser: ResourceUser) => {
                        return resourceUser.enabled;
                    });
                    this.users.sort(this.compareUsers);
                    this.resetUserFormValues(true);
                    this.editMode = false;
                });
            } else {
                this.resetUserFormValues(true);
            }
            },
            (error) => { this.openFailureDialog(); } );
    }

    // TODO: enable deactivation
    onDeactivate() { }

    openSuccessDialog(): void {
        this.dialog.open(UserSubmissionSuccessDialogComponent, DIALOG_STYLE);
    }

    openFailureDialog(): void {
        this.dialog.open(UserSubmissionFailureDialogComponent, DIALOG_STYLE);
    }

    onChange(selectedUser: ResourceUser) {
        this.editMode = !!selectedUser;
        this.resetUserFormValues(false);
        this.selectedRoles = [];
        if (this.editMode) {
            this.setUserFormValues(selectedUser);
        }
        this.userForm.markAsPristine();
    }

    private setUserFormValues(selectedUser: ResourceUser) {
        this.http.get(selectedUser._links.roles.href).subscribe((resourcesRole: ResourcesRole) => {
            resourcesRole._embedded.roles.forEach((role) => {
                this.selectedRoles.push(role);
                this.userForm.get((role.id).toString(10)).setValue('checked');
            });
        });

        this.userForm.get('firstName').setValue(selectedUser.firstName);
        this.userForm.get('middleName').setValue(selectedUser.middleName);
        this.userForm.get('lastName').setValue(selectedUser.lastName);
        this.userForm.get('email').setValue(selectedUser.email);
        this.userForm.get('type').setValue(selectedUser.type);
        this.userForm.get('firstName').updateValueAndValidity();
        this.userForm.get('middleName').updateValueAndValidity();
        this.userForm.get('lastName').updateValueAndValidity();
        this.userForm.get('email').updateValueAndValidity();
        this.userForm.get('type').updateValueAndValidity();
    }

    private resetUserFormValues(hardReset: boolean) {
        for (const name in this.userForm.controls) {
            if (this.userForm.controls.hasOwnProperty(name)) {
                if (hardReset || name !== 'userSelect') {
                    this.userForm.get(name).setValue('');
                }
            }
        }
        this.userForm.get('firstName').updateValueAndValidity();
        this.userForm.get('middleName').updateValueAndValidity();
        this.userForm.get('lastName').updateValueAndValidity();
        this.userForm.get('email').updateValueAndValidity();
        this.userForm.get('type').updateValueAndValidity();
    }

    checkBoxOnChange(checkBoxChange: MatCheckboxChange) {
        const idChecked = (checkBoxChange.source.value as Role).id,
            isSelected = this.selectedRoles.find((role) => {
                return role.id === idChecked;
            });

        if (isSelected) {
            this.selectedRoles.splice(this.selectedRoles.indexOf(isSelected), 1);
        } else {
            this.selectedRoles.push((checkBoxChange.source.value as Role));
        }
    }

    compareUsers(user1: User, user2: User): number {
        const user1String = user1.lastName + user1.firstName + user1.middleName + user1.id,
            user2String = user2.lastName + user2.firstName + user2.middleName + user2.id;

        return user1String.localeCompare(user2String);
    }

}

@Component({
    selector: 'app-user-submission-success-dialog',
    templateUrl: 'user-submission-success-dialog.html',
})
export class UserSubmissionSuccessDialogComponent {

    constructor(public dialogRef: MatDialogRef<FormSubmissionDialogComponent>) {
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}

@Component({
    selector: 'app-user-submission-failure-dialog',
    templateUrl: 'user-submission-failure-dialog.html',
})
export class UserSubmissionFailureDialogComponent {

    constructor(public dialogRef: MatDialogRef<FormSubmissionDialogComponent>) {
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
