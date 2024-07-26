import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

interface IErrorMessage {
    name?: string;
    email?: string;
    password?: string;
}

@Component({
    standalone: true,
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
    ],
})
export class RegistrationComponent implements OnInit {
    registrationForm!: FormGroup;
    readonly name = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
    ]);
    readonly email = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);
    readonly password = new FormControl('', [
        Validators.required,
        Validators.minLength(6),
    ]);
    errorMessage: IErrorMessage = {
        name: '',
        email: '',
        password: '',
    };
    hide: boolean = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar,
    ) {
        this.name.statusChanges.subscribe(() => this.updateErrorMessage());
        this.email.statusChanges.subscribe(() => this.updateErrorMessage());
        this.password.statusChanges.subscribe(() => this.updateErrorMessage());
    }

    ngOnInit(): void {
        this.registrationForm = this.fb.group({
            name: this.name,
            email: this.email,
            password: this.password,
        });
    }

    onRegister(): void {
        if (this.registrationForm.invalid) {
            this.snackBar.open('Please fill out the form correctly.', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
            });
            return;
        }

        const { name, email, password } = this.registrationForm.value;
        this.authService.register(name, email, password).subscribe({
            next: (response) => {
                localStorage.setItem('token', response.token);
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.snackBar.open(
                    'Registration failed. Please check your credentials.',
                    'Close',
                    {
                        duration: 3000,
                        verticalPosition: 'top',
                    },
                );
                console.error(error);
            },
        });
    }

    updateErrorMessage() {
        if (this.name.hasError('required')) {
            this.errorMessage.name = 'You must enter a value';
        } else if (this.email.hasError('minlength')) {
            this.errorMessage.name = 'Name must be at least 2 symbols';
        } else {
            this.errorMessage.name = '';
        }

        if (this.email.hasError('required')) {
            this.errorMessage.email = 'You must enter a value';
        } else if (this.email.hasError('email')) {
            this.errorMessage.email = 'Not a valid email';
        } else {
            this.errorMessage.email = '';
        }

        if (this.password.hasError('required')) {
            this.errorMessage.password = 'You must enter a value';
        } else if (this.password.hasError('minlength')) {
            this.errorMessage.password = 'Password must be at least 6 symbols';
        } else {
            this.errorMessage.password = '';
        }
    }

    toggleHide(): void {
        this.hide = !this.hide;
    }
}
