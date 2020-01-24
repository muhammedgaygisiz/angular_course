import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;

  constructor(
    private http: HttpClient,
    private postService: PostsService
  ) { }

  ngOnInit() {
    this.isFetching = true;
    this.postService.fetchPosts()
      .subscribe(
        posts => {
          this.isFetching = false;
          this.loadedPosts = posts;
        },
        error => {
          this.error = error.message;
          console.log(error);
        }
      );
  }

  onCreatePost(postData: { title: string; content: string }) {
    this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts()
      .subscribe(
        posts => {
          this.isFetching = false;
          this.loadedPosts = posts;
        },
        error => {
          this.error = error.message;
          console.log(error);
        }
      );
  }

  onClearPosts() {
    this.postService.deletePosts()
      .subscribe(() => {
        this.loadedPosts = [];
      });
  }
}
