import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';
import { firstValueFrom } from 'rxjs';
import { INewPost } from '../interfaces/INewPost';
import { Post } from '../interfaces/Post';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {

  public localStorageServiceService: LocalStorageServiceService = inject(LocalStorageServiceService);
  
  public token: string = this.localStorageServiceService.getVariable('token') ||'';

  private baseUrl = 'http://localhost:5095/api';

  private httpclient: HttpClient = inject(HttpClient);

  public errors: string[] = [];

  async addPost(post: INewPost, imageFile: File): Promise<string> {
    try {
  
      const formData = new FormData();
      formData.append('Title', post.title);
      formData.append('Publication_date', post.publication_date);
      formData.append('Image', imageFile);
  
      const headers = {
        Authorization: `Bearer ${this.token}`,
      };

      const response = await firstValueFrom(
        this.httpclient.post<string>(`${this.baseUrl}/Post`, formData, { headers })
      );
  
      return Promise.resolve(response);
    } catch (error) {
      console.log('Error in addPost service', error);
      this.errors.push((error as any).message);
      return Promise.reject(error);
    }
  }  

  async getPosts(): Promise<Post> {
    try {
      const headers = {
        Authorization: `Bearer ${this.token}`,
      };

      const response = await firstValueFrom(
        this.httpclient.get<Post>(`${this.baseUrl}/Post`, { headers })
      );

      return Promise.resolve(response);
    } catch (error) {
      console.log('Error in getPosts service', error);
      this.errors.push((error as any).message);
      return Promise.reject(error);
    }
  }
}