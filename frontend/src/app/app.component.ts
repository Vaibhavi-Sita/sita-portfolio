import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StateService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent implements OnInit {
  private readonly state = inject(StateService);

  ngOnInit(): void {
    // Apply initial dark mode
    if (this.state.darkMode()) {
      document.body.classList.add('dark-theme');
    }
  }
}
