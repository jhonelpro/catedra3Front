import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastService } from '../../../_shared/services/toast.service';
import { PostServiceService } from '../../services/post-service.service';
import { INewPost } from '../../interfaces/INewPost';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-post-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  providers: [PostServiceService],
  templateUrl: './create-post-page.component.html',
  styleUrl: './create-post-page.component.css'
})
export class CreatePostPageComponent {

  private toastService: ToastService = inject(ToastService);

  private postServiceService: PostServiceService = inject(PostServiceService);
  
  forms!: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.forms = this.formBuilder.group({
      title: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(100)
      ]],
      publicationDate: ['', [
        Validators.required
      ]],
      image: ['', [
        Validators.required, 
        this.validateImage()
      ]]
    });
  }
  
  private validateImage(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !(control.value instanceof File)) return null;
  
      const file = control.value as File;
      const validMimeTypes = ['image/png', 'image/jpeg'];
      const validExtensions = ['.png', '.jpeg'];
      const maxSize = 5 * 1024 * 1024;
  
      const errors: ValidationErrors = {};
  
      if (!validMimeTypes.includes(file.type)) {
        errors['invalidImageFormat'] = true;
      }
  
      const fileName = file.name.toLowerCase();
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
      if (!hasValidExtension) {
        errors['invalidImageFormat'] = true;
      }
  
      if (file.size > maxSize) {
        errors['imageTooLarge'] = true;
      }
  
      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  getFieldError() {
    const titleControl = this.forms.get('title');
    if (titleControl?.hasError('required')) {
      return 'El título es requerido';
    }
    if (titleControl?.hasError('minlength')) {
      return 'El título debe tener al menos 3 caracteres';
    }
    if (titleControl?.hasError('maxlength')) {
      return 'El título no puede tener más de 100 caracteres';
    }
    return '';
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      const validExtensions = ['.png', '.jpg', '.jpeg'];
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
      if (!hasValidExtension) {
        this.forms.get('image')?.setErrors({ invalidImageFormat: true });
        this.forms.get('image')?.markAsTouched();
        return;
      }
  
      this.selectedImage = file;
      this.forms.get('image')?.setValue(file);
      this.forms.get('image')?.markAsTouched();
      this.forms.get('image')?.updateValueAndValidity();
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.forms.get('image')?.setValue(null);
    this.forms.get('image')?.markAsTouched();
    this.forms.get('image')?.updateValueAndValidity();
  }

  async addPublication() {
    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      console.log('Formulario inválido');
      return;
    }
    
    console.log('Formulario válido');
    const title = this.forms.get('title')?.value;
    const publication_date = this.forms.get('publicationDate')?.value;
    const image = this.forms.get('image')?.value as File;
  
    const post: INewPost = {
      title,
      publication_date,
    };
  
    try {
      await this.postServiceService.addPost(post, image);
      this.toastService.success('Post creado correctamente');
      this.forms.reset();
    } catch (error) {
      this.toastService.error('Error al crear el post');
      this.forms.reset();
    }
  }

}
