import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import { Todo } from '../../models/todo.model';
import * as TodoActions from '../../store/actions/todo.actions';
import * as TodoSelectors from '../../store/selectors/todo.selectors';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoFilterComponent } from '../todo-filter/todo-filter.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    LucideAngularModule,
    TodoFormComponent,
    TodoItemComponent,
    TodoFilterComponent,
  ],
  template: `
    <div class="max-w-6xl mx-auto p-4">
      <app-todo-form class="mb-8 block"></app-todo-form>

      <app-todo-filter
        (filterChange)="onFilterChange($event)"
        class="mb-6 max-w-2xl mx-auto"
      ></app-todo-filter>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <!-- Tâches à faire -->
        <div class="bg-white rounded-lg shadow p-4">
          <h2
            class="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2"
          >
            <i-lucide name="list-todo" class="w-5 h-5" />
            À faire
          </h2>

          <div
            cdkDropList
            #todoList="cdkDropList"
            [cdkDropListData]="activeTodos$ | async"
            [cdkDropListConnectedTo]="[doneList]"
            (cdkDropListDropped)="drop($event)"
            class="min-h-[200px]"
          >
            <ng-container *ngIf="activeTodos$ | async as todos">
              <div
                *ngFor="let todo of todos; trackBy: trackById"
                cdkDrag
                class="mb-2"
              >
                <app-todo-item [todo]="todo"></app-todo-item>
              </div>

              <div
                *ngIf="todos.length === 0"
                class="text-center p-8 text-gray-500 border-2 border-dashed rounded-lg"
              >
                Aucune tâche à faire
              </div>
            </ng-container>
          </div>
        </div>

        <!-- Tâches terminées -->
        <div class="bg-white rounded-lg shadow p-4">
          <h2
            class="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2"
          >
            <i-lucide name="check-square" class="w-5 h-5" />
            Terminées
          </h2>

          <div
            cdkDropList
            #doneList="cdkDropList"
            [cdkDropListData]="completedTodos$ | async"
            [cdkDropListConnectedTo]="[todoList]"
            (cdkDropListDropped)="drop($event)"
            class="min-h-[200px]"
          >
            <ng-container *ngIf="completedTodos$ | async as todos">
              <div
                *ngFor="let todo of todos; trackBy: trackById"
                cdkDrag
                class="mb-2"
              >
                <app-todo-item [todo]="todo"></app-todo-item>
              </div>

              <div
                *ngIf="todos.length === 0"
                class="text-center p-8 text-gray-500 border-2 border-dashed rounded-lg"
              >
                Aucune tâche terminée
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TodoListComponent implements OnInit {
  private store = inject(Store);
  private searchBar = '';

  activeTodos$ = this.store.select(TodoSelectors.selectActiveTodos);
  completedTodos$ = this.store.select(TodoSelectors.selectCompletedTodos);
  error$ = this.store.select(TodoSelectors.selectTodoError);

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  trackById(index: number, todo: Todo): string {
    return todo.id;
  }

  drop(event: CdkDragDrop<Todo[] | null>): void {
    const previousData = event.previousContainer.data;
    const currentData = event.container.data;

    if (!previousData || !currentData) return;

    if (event.previousContainer === event.container) {
      // Déplacement graphique
      const todos = [...currentData];
      moveItemInArray(todos, event.previousIndex, event.currentIndex);

      // Met à jour les positions
      const todoIds = todos.map((todo) => todo.id);
      const completed = todos[0]?.completed ?? false; // Vérifie si c'est la colonne completed
      this.store.dispatch(TodoActions.reorderTodos({ todoIds, completed }));
    } else {
      // Changement de colonne
      const todo = previousData[event.previousIndex];
      if (todo) {
        this.store.dispatch(TodoActions.toggleTodo({ id: todo.id }));
      }
    }
  }

  private filterTodos(todos: Todo[]): Todo[] {
    if (!this.searchBar) return todos;

    const term = this.searchBar.toLowerCase();
    return todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(term) ||
        todo.description?.toLowerCase().includes(term)
    );
  }

  onFilterChange(searchTerm: string): void {
    this.searchBar = searchTerm;

    this.activeTodos$ = this.store
      .select(TodoSelectors.selectActiveTodos)
      .pipe(map((todos) => this.filterTodos(todos)));

    this.completedTodos$ = this.store
      .select(TodoSelectors.selectCompletedTodos)
      .pipe(map((todos) => this.filterTodos(todos)));
  }
}
