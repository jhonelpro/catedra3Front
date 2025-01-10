import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LogIn } from '../interfaces/LogIn';
import { AuthInfo } from '../interfaces/AuthInfo';
import { SignUp } from '../interfaces/SignUp';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  public localStorageServiceService: LocalStorageServiceService = inject(LocalStorageServiceService);

  public token: string = this.localStorageServiceService.getVariable('token') ||'';

  private baseUrl = 'http://localhost:5095/api/Auth';

  private httpclient: HttpClient = inject(HttpClient);

  public errors: string[] = [];

  async login(logIn: LogIn): Promise<AuthInfo> {
    try {
      const response = await firstValueFrom(this.httpclient.post<AuthInfo>(`${this.baseUrl}/login`, logIn));
      return Promise.resolve(response);
    } catch (error) {
      console.log("Error in login service", error);
      this.errors.push((error as any).message);
      return Promise.reject(error);
    }
  }

  async signUp(signUp: SignUp): Promise<string> {
    try {
      const response = await firstValueFrom(this.httpclient.post<string>(`${this.baseUrl}/register`, signUp));
      return Promise.resolve(response);
    } catch (error) {
      console.log("Error in signUp service", error);
      this.errors.push((error as any).message);
      return Promise.reject(error);
    }
  }
}
