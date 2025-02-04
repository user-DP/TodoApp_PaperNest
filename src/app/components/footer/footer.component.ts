import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer class="bg-slate-200  text-center py-4">
      <p>
        2025 - Todo App Papernest - Thomas DEBRAND-PASSARD -
        <a [href]="this.GITHUB_URL">Github</a>
      </p>
    </footer>
  `,
})
export class FooterComponent {
  readonly GITHUB_URL = 'https://github.com/user-DP';
}
