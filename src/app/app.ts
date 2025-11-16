import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationPage } from './navigation/pages/navigation-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestion_desastres');
}
