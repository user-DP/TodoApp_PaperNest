import { Component } from '@angular/core';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';

@Component({
  selector: 'app-todo-page',
  imports: [TodoListComponent],
  template: `
    <div class="min-h-screen bg-gray-100 py-8">
      <app-todo-list></app-todo-list>
    </div>
  `,
})
export class TodoPage {}
