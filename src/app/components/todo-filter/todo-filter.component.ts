import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-todo-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="inline-flex border-2 rounded min-w-full border-gray-600">
      <i-lucide name="search" class="w-5 h-5 self-center text-gray-400 mx-2" />
      <input
        type="text"
        [(ngModel)]="searchTerm"
        (ngModelChange)="onSearch($event)"
        placeholder="Rechercher une tâche..."
        class="w-full p-4 outline-none"
      />
    </div>
  `,
})
export class TodoFilterComponent {
  @Output() filterChange = new EventEmitter<string>();

  searchTerm = '';

  onSearch(term: string): void {
    this.filterChange.emit(term);
  }
}
