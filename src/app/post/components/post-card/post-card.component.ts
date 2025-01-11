import { Component, Input, input } from '@angular/core';
import { Info, Post } from '../../interfaces/Post';

@Component({
  selector: 'app-post-card',
  imports: [],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {

  @Input() post!: Info; 

}
