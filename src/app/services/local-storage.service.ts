import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly TODO_KEY = 'todos';

  getTodos(): Todo[] {
    const todos = localStorage.getItem(this.TODO_KEY);
    return todos ? JSON.parse(todos) : [];
  }

  saveTodos(todos: Todo[]): void {
    const existingTodos = this.getTodos();
    const updatedTodos = this.mergeTodos(existingTodos, todos);
    localStorage.setItem(this.TODO_KEY, JSON.stringify(updatedTodos));
  }

  addTodo(todo: Todo): void {
    const todos = this.getTodos();
    todos.push(todo);
    this.saveTodos(todos);
  }

  updateTodo(todo: Todo): void {
    const todos = this.getTodos();
    const index = todos.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      todos[index] = todo;
      this.saveTodos(todos);
    }
  }

  deleteTodo(id: string): void {
    const todos = this.getTodos();
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    localStorage.setItem(this.TODO_KEY, JSON.stringify(filteredTodos));
  }

  private mergeTodos(existing: Todo[], updated: Todo[]): Todo[] {
    // Crée une Map des todos existants
    const todoMap = new Map(existing.map((todo) => [todo.id, todo]));

    // Met à jour ou ajoute les nouveaux todos
    updated.forEach((todo) => {
      todoMap.set(todo.id, todo);
    });

    // Convertit la Map en array
    return Array.from(todoMap.values());
  }
}
