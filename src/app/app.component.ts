import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NavBarComponent } from "./_shared/components/nav-bar/nav-bar.component";
import { ToastComponent } from './_shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'catedra3';

  ngOnInit(): void {
    initFlowbite();
  }
}
