import { Component, OnInit } from '@angular/core';
import {ResourcesUser, ResourceUser, User} from '../';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    userForm: FormGroup;
    users: ResourcesUser;
    editMode: boolean;
    user: User = {
        firstName: '',
        lastName: '',
        middleName: '',
        email: ''
    };

    constructor(private actr: ActivatedRoute) { }

    ngOnInit() {
        this.userForm = new FormGroup({
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
            ])
        });

        const usersResolver = this.actr.snapshot.data.usersResolver;
        this.users = usersResolver._embedded.users.filter((resourceUser: ResourceUser) => {
            return resourceUser.enabled;
        });
    }

    onSubmit() { }

    onDeactivate() { }

    onChange(selectedUser: ResourceUser) {
        if (selectedUser !== '') {
            this.editMode = true;
            this.user = {
                firstName: selectedUser.firstName,
                middleName: selectedUser.middleName,
                lastName: selectedUser.lastName,
                email: selectedUser.email
            };
            this.setUserFormValues(selectedUser);
        } else {
            this.editMode = false;
            this.user = {
                firstName: '',
                middleName: '',
                lastName: '',
                email: ''
            };
            this.resetUserFormValues();
        }
    }

    private setUserFormValues(selectedUser: ResourceUser) {
        this.userForm.get('firstName').setValue(selectedUser.firstName);
        this.userForm.get('middleName').setValue(selectedUser.middleName);
        this.userForm.get('lastName').setValue(selectedUser.lastName);
        this.userForm.get('email').setValue(selectedUser.email);
        this.userForm.get('firstName').updateValueAndValidity();
        this.userForm.get('middleName').updateValueAndValidity();
        this.userForm.get('lastName').updateValueAndValidity();
        this.userForm.get('email').updateValueAndValidity();
    }

    private resetUserFormValues() {
        this.userForm.get('firstName').setValue('');
        this.userForm.get('middleName').setValue('');
        this.userForm.get('lastName').setValue('');
        this.userForm.get('email').setValue('');
        this.userForm.get('firstName').updateValueAndValidity();
        this.userForm.get('middleName').updateValueAndValidity();
        this.userForm.get('lastName').updateValueAndValidity();
        this.userForm.get('email').updateValueAndValidity();
    }

}
