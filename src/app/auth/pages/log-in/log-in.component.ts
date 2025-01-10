import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { LocalStorageServiceService } from '../../../_shared/services/local-storage-service.service';
import { ToastService } from '../../../_shared/services/toast.service';

@Component({
  selector: 'app-log-in',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [AuthServiceService, LocalStorageServiceService],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent implements OnInit {

  private authService: AuthServiceService = inject(AuthServiceService);

  private localStorageService: LocalStorageServiceService = inject(LocalStorageServiceService);

  private toastService: ToastService = inject(ToastService);

  public confirmMessage: string = '';

  forms!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.forms = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*\d).+$/)])]
    });
  }

  async onSubmit() {
    console.log('Formulario válido:', this.forms.valid);
    if (this.forms.invalid) {
      console.log('Formulario inválido, no se enviará');
    }

    try {
      if (this.forms.invalid){
        this.toastService.error('Por favor, complete los campos correctamente.');
        return;
      }
      
      const logInDto = this.forms.value;
      const response = await this.authService.login(logInDto);

      if (response) {
        if (response.token) {
          this.authService.errors = [];
          this.localStorageService.setVariable('token', response.token);
          this.localStorageService.setVariable('user', response.email);
          console.log('usuario:', this.localStorageService.getVariable('user'));
          console.log(response);
          this.confirmMessage = 'Usuario logueado correctamente.';
          this.toastService.success('Usuario logueado correctamente.');
        } else {
          console.log('Error al loguear el usuario', this.authService.errors);
          const lastError = this.authService.errors[this.authService.errors.length - 1];
          this.toastService.error(lastError || 'Error al loguear el usuario.');
        }
      } else {
        console.log('Error al loguear el usuario', this.authService.errors);
        const lastError = this.authService.errors[this.authService.errors.length - 1];
        this.toastService.error(lastError || 'Error al loguear el usuario.');
      }
    } catch (error) {
      console.log('Error al loguear el usuario', this.authService.errors);
      if(error instanceof HttpErrorResponse)
        {
          const errorMessage = 
            typeof error.error === 'string' ? error.error : error.error.message
          this.toastService.error(errorMessage || 'Error al loguear el usuario');
        }
    }
  }

  get EmailErrors() {
    const email = this.forms.get('email');
    if (email?.invalid && email?.touched) {
      if (email.hasError('required')) {
        return 'El correo es obligatorio.';
      }
      if (email.hasError('email')) {
        return 'El correo debe ser válido.';
      }
    }
    return null;
  }
  
  get PasswordErrors() {
    const password = this.forms.get('password');
    if (password?.invalid && password?.touched) {
      if (password.hasError('required')) {
        return 'La contraseña es obligatoria.';
      }
      if (password.hasError('minlength')) {
        return 'La contraseña debe tener al menos 6 caracteres.';
      }
      if (password.hasError('pattern')) {
        return 'La contraseña debe tener al menos un número.';
      }
    }
    return null;
  }
}
