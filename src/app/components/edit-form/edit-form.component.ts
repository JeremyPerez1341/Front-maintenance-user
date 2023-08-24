import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, Validators } from '@angular/forms';
import { HttpDataService } from 'src/app/services/http-data.service';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent {
  userData: any = {
    name: '',
    lastName: '',
    login: '',
    password: '',
    state: 'Activo'
  };

  showOptions: boolean = false;
  newState!: string;
  newPassword!: string;
  confirmPassword!: string;
  showLastChar = false;

  options: any[] = ['Activo', 'Bloqueado', 'Eliminado'];

  constructor(private route: ActivatedRoute, private httpDataService: HttpDataService, public dialog: MatDialog, private router: Router) { }

  nameControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$'),
    Validators.maxLength(55)
  ]);

  lastNameControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$'),
    Validators.maxLength(55)
  ]);

  loginControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[A-Za-z0-9]+$'),
    Validators.minLength(3),
    Validators.maxLength(25)
  ]);

  newPasswordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(25)
  ]);
  confirmPasswordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(25)
  ]);

  newStateControl = new FormControl('', Validators.required);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['user']) { // case of existing user
        this.userData = JSON.parse(params['user']);
        console.log(this.userData);
        this.newState = this.userData.state;
        this.showOptions = true;
      } else { // case of new user
        this.newState = 'Activo';
      this.showOptions = true;
      }
    });
  }

  hasErrors(): boolean {
    return [this.nameControl, this.lastNameControl, this.loginControl].some(
      control => control.invalid && control.dirty) || this.passwordsNotMatch;
  }

  get passwordsNotMatch() {
    return this.newPasswordControl.value !== this.confirmPasswordControl.value;
  }
  
  updateOrCreateUser(id: string, data: any): void {
    const updateUserData = {
      name: this.userData.name,
      lastName: this.userData.lastName,
      login: this.userData.login,
      password: this.newPassword !== undefined ? this.newPassword : this.userData.password, // Password confirmation
      state: this.newState
    }

    const userObservable = id ?
    this.httpDataService.updateUser(id, updateUserData) :
    this.httpDataService.createUser(updateUserData);

    userObservable.subscribe(() => {
        this.router.navigate(['/home']); 
      },
    (error: any) => {
      console.log(this.userData.password);
      console.log(this.newPassword);
      console.error('Error:', error);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.updateOrCreateUser(this.userData.id, this.userData);
      }
    });
  }

}

@Component ({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmDialogComponent {
  constructor(public dialog: MatDialogRef<ConfirmDialogComponent>) {}

  onNoClick(): void {
    this.dialog.close();
  }

  onSaveClick(): void {
    this.dialog.close('save'); // Pass a value to indicate saving
  }
}