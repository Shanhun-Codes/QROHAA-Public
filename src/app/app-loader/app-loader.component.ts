import { Component, inject } from '@angular/core';
import { AppLoaderService } from './app-loader.service';

@Component({
  selector: 'app-app-loader',
  standalone: true,
  imports: [],
  templateUrl: './app-loader.component.html',
  styleUrl: './app-loader.component.scss',
})
export class AppLoaderComponent {
  public readonly appLoaderService = inject(AppLoaderService);
}
