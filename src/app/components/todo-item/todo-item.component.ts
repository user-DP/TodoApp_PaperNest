import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { Todo } from '../../models/todo.model';
import * as TodoActions from '../../store/actions/todo.actions';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div
      class="flex items-center p-4 border-b group hover:bg-gray-50"
      (click)="$event.stopPropagation()"
    >
      <i-lucide
        name="grip-vertical"
        class="w-5 h-5 mr-2 text-gray-400 cursor-move"
      />

      <div class="flex-1">
        <!-- Mode vue -->
        <ng-container *ngIf="!isEditing">
          <h3
            [class.line-through]="todo.completed"
            [class.text-gray-500]="todo.completed"
            class="text-lg font-medium"
          >
            {{ todo.title }}
          </h3>
          <p *ngIf="todo.description" class="text-gray-600 mt-1 break-all">
            {{ todo.description }}
          </p>
        </ng-container>

        <!-- Mode édition -->
        <div *ngIf="isEditing" class="space-y-2">
          <input
            type="text"
            [(ngModel)]="editedTitle"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Titre de la tâche"
          />
          <textarea
            [(ngModel)]="editedDescription"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Description (optionnel)"
            rows="2"
          ></textarea>
          <div class="flex gap-2">
            <button
              (click)="saveEdit()"
              class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sauvegarder
            </button>
            <button
              (click)="cancelEdit()"
              class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2" *ngIf="!isEditing">
        <button
          (click)="startEdit()"
          class="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
        >
          <i-lucide name="edit" class="w-5 h-5" />
        </button>

        <button
          (click)="deleteTodo()"
          class="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
        >
          <i-lucide name="trash-2" class="w-5 h-5" />
        </button>
      </div>
    </div>
  `,
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  private store = inject(Store);

  isEditing = false;
  editedTitle = '';
  editedDescription = '';

  startEdit(): void {
    this.isEditing = true;
    this.editedTitle = this.todo.title;
    this.editedDescription = this.todo.description || '';
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedTitle = '';
    this.editedDescription = '';
  }

  saveEdit(): void {
    if (this.editedTitle.trim()) {
      this.store.dispatch(
        TodoActions.updateTodo({
          id: this.todo.id,
          changes: {
            title: this.editedTitle.trim(),
            description: this.editedDescription.trim() || undefined,
          },
        })
      );
      this.isEditing = false;
    }
  }

  deleteTodo(): void {
    this.store.dispatch(TodoActions.deleteTodo({ id: this.todo.id }));
  }
}
