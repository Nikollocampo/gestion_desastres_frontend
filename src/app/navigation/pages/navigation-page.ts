import { Component } from '@angular/core';
import { Footer } from "../components/footer/footer";
import { Header } from '../components/header/header';
import { Menu } from '../components/menu/menu';

@Component({
  selector: 'app-navigation-page',
  standalone: true,
  imports: [Footer, Header, Menu],
  templateUrl: './navigation-page.html',
  styleUrl: './navigation-page.css',
})
export class NavigationPage {

}
