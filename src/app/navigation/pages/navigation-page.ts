import { Component } from '@angular/core';
import { Footer } from "../components/footer/footer";
import { Header } from '../components/header/header';
import { Menu } from '../components/menu/menu';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navigation-page',
  standalone: true,
  imports: [Footer, Header, Menu, RouterOutlet],
  templateUrl: './navigation-page.html',
  styleUrl: './navigation-page.css',
})
export class NavigationPage {

}
