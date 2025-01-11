import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { PostServiceService } from '../../services/post-service.service';
import { Info, Post } from '../../interfaces/Post';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from "../../components/post-card/post-card.component";

@Component({
  selector: 'app-post-page',
  imports: [HttpClientModule, CommonModule, PostCardComponent],
  providers: [PostServiceService],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.css'
})
export class PostPageComponent implements OnInit {
  
  private postServiceService: PostServiceService = inject(PostServiceService);

  public posts!: Info[];
  public errors: string[] = [];

  ngOnInit() {
    this.getPosts();
  }

  async getPosts() {
    try {
      const response = await this.postServiceService.getPosts();

      if (response) {
        this.posts = response.value as unknown as Info[];
        this.postServiceService.errors = [];
      }
    } catch (error) {
      console.log('Error en getPosts', error);
      this.errors.push((error as any).message);
    }
  }
}
