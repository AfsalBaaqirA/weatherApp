import { Component, ViewChild, OnInit } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router, NavigationExtras, NavigationError } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { User } from 'src/enums/enums';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  title = 'Login';
  hide!: boolean;
  signIn!: boolean;
  username!: string;
  password!: string;
  rePassword!: string;
  mailId!: string;
  name!: string;
  phoneNo!: string;
  message!: string;
  durationInSeconds!: number;
  horizontalPosition!: MatSnackBarHorizontalPosition;
  verticalPosition!: MatSnackBarVerticalPosition;
  color!: string;

  users: User[] = [
    {
      username: 'admin',
      password: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      phoneNo: '1234567890',
    },
  ];

  constructor(
    private titleService: Title,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.titleService.setTitle(this.title);
  }
  ngOnInit(): void {
    this.hide = true;
    this.signIn = false;
    this.username = '';
    this.password = '';
    this.message = '';
    this.durationInSeconds = 0;
    this.horizontalPosition = 'center';
    this.verticalPosition = 'bottom';
    this.color = '';
  }
  @ViewChild('loginloadbar') loginloadbar!: MatProgressBar;
  login() {
    this.loginloadbar.mode = 'indeterminate';
    if (this.validate()) {
      const user: User | undefined = this.users.find(
        (u) => u.username === this.username
      );
      if (user && user.password && user.password === this.password) {
        // Send data to dashboard component as query params
        const navigationExtras: NavigationExtras = {
          queryParams: {
            username: user.username,
            name: user.name,
            email: user.email,
            phoneNo: user.phoneNo,
          },
        };
        this.router.navigate(['/dashboard'], navigationExtras);
      } else {
        this.message = 'Invalid Username or Password';
        this.color = 'mat-warn';
        this.durationInSeconds = 2 * 1000;
        this.openSnackBar(this.message, this.color, this.durationInSeconds);
      }
    }
    setTimeout(() => {
      this.loginloadbar.mode = 'determinate';
    }, 2000);
  }
  validate() {
    console.log(this.username, this.password);
    if (this.username.length < 1) {
      this.message = "Username can't be empty";
      this.color = 'mat-warn';
      this.durationInSeconds = 2 * 1000;
      this.openSnackBar(this.message, this.color, this.durationInSeconds);
      return false;
    } else {
      if (this.password.length < 1) {
        this.message = "Password can't be empty";
        this.color = 'mat-warn';
        this.durationInSeconds = 2 * 1000;
        this.openSnackBar(this.message, this.color, this.durationInSeconds);
        return false;
      }
    }
    return true;
  }
  openSnackBar(message: string, color: string, duration: number) {
    this._snackBar.open(message, '', {
      duration: duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackBar'],
    });
  }

  signUp() {
    if (
      this.username.length > 0 ||
      this.password.length > 0 ||
      this.rePassword.length > 0 ||
      this.name.length > 0 ||
      this.mailId.length > 0 ||
      this.phoneNo.length > 0
    ) {
      const userByName: User | undefined = this.users.find(
        (u) => u.username === this.username
      );
      if (userByName) {
        this.message = 'Username already taken!';
        this.color = 'mat-warn';
        this.durationInSeconds = 2 * 1000;
        this.openSnackBar(this.message, this.color, this.durationInSeconds);
        return;
      }
      const userByMail: User | undefined = this.users.find(
        (u) => u.email === this.mailId
      );
      if (userByMail) {
        this.message =
          'Email already exists<br>Kindly use another email or login with the existing email';
        this.color = 'mat-warn';
        this.durationInSeconds = 2 * 1000;
        this.openSnackBar(this.message, this.color, this.durationInSeconds);
        return;
      }
      if (this.phoneNo.length !== 10) {
        this.message = 'Invalid Phone Number';
        this.color = 'mat-warn';
        this.durationInSeconds = 2 * 1000;
        this.openSnackBar(this.message, this.color, this.durationInSeconds);
        return;
      }
      if (this.password !== this.rePassword) {
        this.message = 'Passwords do not match';
        this.color = 'mat-warn';
        this.durationInSeconds = 2 * 1000;
        this.openSnackBar(this.message, this.color, this.durationInSeconds);
        return;
      }

      const new_user: User = {
        username: this.username,
        password: this.password,
        name: this.name,
        email: this.mailId,
        phoneNo: this.phoneNo,
      };

      this.users.push(new_user);
      this.signIn = false;
      this.message =
        'User registered successfully<br>Redirecting to Login Page';
      this.color = 'mat-primary';
      this.durationInSeconds = 2 * 1000;
      this.openSnackBar(this.message, this.color, this.durationInSeconds);
    } else {
      this.message = 'Please fill all required fields';
      this.color = 'mat-warn';
      this.durationInSeconds = 2 * 1000;
      this.openSnackBar(this.message, this.color, this.durationInSeconds);
    }
  }
}
