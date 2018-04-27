import { Component, OnInit } from '@angular/core';
import {ResourcesUser, ResourceUser, User, UserEntityService} from '../';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {FormSubmissionDialogComponent} from '../dynamic-form/dynamic-form.component';
import {DIALOG_STYLE} from '../forms-common/dialog';
import {MatDialog, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['../card.css']
})
export class UserComponent implements OnInit {
    userForm: FormGroup;
    users: ResourcesUser;
    editMode: boolean;
    user: User;

    constructor(private actr: ActivatedRoute,
                private userEntityService: UserEntityService,
                public dialog: MatDialog) { }

    ngOnInit() {
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

        const usersResolver = this.actr.snapshot.data.usersResolver;
        this.users = usersResolver._embedded.users.filter((resourceUser: ResourceUser) => {
            return resourceUser.enabled;
        });
    }

    onSubmit() {
        this.user = {
            firstName: this.userForm.get('firstName').value,
            lastName: this.userForm.get('lastName').value,
            email: this.userForm.get('email').value,
            type: this.userForm.get('type').value,
            password: 'a'
        };

        if (this.userForm.get('middleName').value) {
            this.user.middleName = this.userForm.get('middleName').value;
        }

        if (this.editMode) {
            this.user.id = this.userForm.get('userSelect').value.id;
        }

        const saveObservable = this.editMode ? this.userEntityService.saveUserUsingPATCH(this.user.id, this.user)
            : this.userEntityService.saveUserUsingPOST(this.user);
        saveObservable.subscribe((response) => { this.openSuccessDialog(); },
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
        if (selectedUser) {
            this.editMode = true;
            this.setUserFormValues(selectedUser);
        } else {
            this.editMode = false;
            this.resetUserFormValues();
        }
    }

    private setUserFormValues(selectedUser: ResourceUser) {
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

    private resetUserFormValues() {
        this.userForm.get('firstName').setValue('');
        this.userForm.get('middleName').setValue('');
        this.userForm.get('lastName').setValue('');
        this.userForm.get('email').setValue('');
        this.userForm.get('type').setValue('');
        this.userForm.get('firstName').updateValueAndValidity();
        this.userForm.get('middleName').updateValueAndValidity();
        this.userForm.get('lastName').updateValueAndValidity();
        this.userForm.get('email').updateValueAndValidity();
        this.userForm.get('type').updateValueAndValidity();
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
