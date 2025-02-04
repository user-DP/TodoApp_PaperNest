import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import * as TodoActions from '../../store/actions/todo.actions';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form
      [formGroup]="todoForm"
      (ngSubmit)="onSubmit()"
      class="p-4 bg-white rounded-lg shadow"
    >
      <div class="space-y-4">
        <div>
          <input
            type="text"
            formControlName="title"
            placeholder="Que souhaitez-vous faire ?"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <textarea
            formControlName="description"
            placeholder="Description (optionnel)"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>
        <button
          type="submit"
          [disabled]="!todoForm.valid"
          class="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Ajouter
        </button>
      </div>
    </form>
  `,
})
export class TodoFormComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  todoForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
  });

  onSubmit(): void {
    if (this.todoForm.valid) {
      this.store.dispatch(
        TodoActions.addTodo({
          todo: {
            title: this.todoForm.value.title,
            description: this.todoForm.value.description,
            completed: false,
          },
        })
      );
      this.todoForm.reset();
    }
  }
}
