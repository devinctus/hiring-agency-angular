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
    email?: string;
    password?: string;
}

@Component({
    standalone: true,
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
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
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    readonly email = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);
    readonly password = new FormControl('', [
        Validators.required,
        Validators.minLength(6),
    ]);
    errorMessage: IErrorMessage = {
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
        this.email.statusChanges.subscribe(() => this.updateErrorMessage());
        this.password.statusChanges.subscribe(() => this.updateErrorMessage());
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: this.email,
            password: this.password,
        });
    }

    onLogin(): void {
        if (this.loginForm.invalid) {
            this.snackBar.open('Please fill out the form correctly.', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
            });
            return;
        }

        const { email, password } = this.loginForm.value;
        this.authService.login(email, password).subscribe({
            next: (response) => {
                localStorage.setItem('token', response.token);
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.snackBar.open(
                    'Login failed. Please check your credentials.',
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
