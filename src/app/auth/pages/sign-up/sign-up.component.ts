import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../_shared/services/toast.service';
import { LocalStorageServiceService } from '../../../_shared/services/local-storage-service.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [AuthServiceService, LocalStorageServiceService],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  private authService: AuthServiceService = inject(AuthServiceService);
  
    private toastService: ToastService = inject(ToastService);
  
    public confirmMessage: string = '';
  
    forms!: FormGroup;
  
    constructor(private formBuilder: FormBuilder, private router: Router) {}
  
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
        
        const signUpDto = this.forms.value;
        const response = await this.authService.signUp(signUpDto);
  
        if (response) {
          this.authService.errors = [];
          this.toastService.success('Usuario registrado correctamente.');
          this.router.navigate(['/login']);
        }
      } catch (error) {
        console.log('Error en el registro', error);
        if (error instanceof HttpErrorResponse) {
          this.toastService.error('Error en el registro.');
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
