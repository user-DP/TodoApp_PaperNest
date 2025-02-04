import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import {
  map,
  mergeMap,
  catchError,
  withLatestFrom,
  tap,
  take,
} from 'rxjs/operators';
import { LocalStorageService } from '../../services/local-storage.service';
import * as TodoActions from '../actions/todo.actions';
import { selectAllTodos, selectTodoById } from '../selectors/todo.selectors';
import { Todo } from '../../models/todo.model';

@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private localStorageService = inject(LocalStorageService);

  /*
   * @ngrx/effects loadTodos$
   * Description: Gère le chargement initial des todos depuis le localStorage
   * Succès: loadTodosSuccess avec la liste des todos
   * Échec: loadTodosFailure avec le message d'erreur
   */
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      mergeMap(() => {
        const todos = this.localStorageService.getTodos();
        return of(TodoActions.loadTodosSuccess({ todos }));
      }),
      catchError((error) =>
        of(TodoActions.loadTodosFailure({ error: error.message }))
      )
    )
  );

  /*
   * @ngrx/effects addTodo$
   * Description: Ajoute un nouveau todo dans le localStorage
   * Transformation: Génère un ID unique et ajoute les timestamps
   * Succès: addTodoSuccess avec le todo créé
   * Échec: addTodoFailure avec le message d'erreur
   */
  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      map((action) => {
        const todo = {
          ...action.todo,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.localStorageService.addTodo(todo);
        return TodoActions.addTodoSuccess({ todo });
      }),
      catchError((error) =>
        of(TodoActions.addTodoFailure({ error: error.message }))
      )
    )
  );

  /*
   * @ngrx/effects updateTodo$
   * Description: Met à jour un todo existant dans le localStorage
   * Transformation: Met à jour le timestamp de modification
   * Succès: updateTodoSuccess avec le todo modifié
   * Échec: updateTodoFailure avec le message d'erreur
   */
  updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodo),
      withLatestFrom(this.store.select(selectAllTodos)),
      map(([action, todos]) => {
        const todo = todos.find((t) => t.id === action.id);
        if (!todo) throw new Error('Todo not found');

        const updatedTodo = {
          ...todo,
          ...action.changes,
          updatedAt: new Date(),
        };
        this.localStorageService.updateTodo(updatedTodo);
        return TodoActions.updateTodoSuccess({ todo: updatedTodo });
      }),
      catchError((error) =>
        of(TodoActions.updateTodoFailure({ error: error.message }))
      )
    )
  );

  /*
   * @ngrx/effects deleteTodo$
   * Description: Supprime un todo du localStorage
   * Succès: deleteTodoSuccess avec l'ID du todo supprimé
   * Échec: deleteTodoFailure avec le message d'erreur
   */
  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      map((action) => {
        this.localStorageService.deleteTodo(action.id);
        return TodoActions.deleteTodoSuccess({ id: action.id });
      }),
      catchError((error) =>
        of(TodoActions.deleteTodoFailure({ error: error.message }))
      )
    )
  );

  /*
   * @ngrx/effects toggleTodo$
   * Description: Passe un todo en mode terminé ou non terminé
   * Succès: toggleTodoSuccess avec le todo mis à jour
   * Échec: toggleTodoFailure avec le message d'erreur
   */
  toggleTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggleTodo),
      mergeMap(({ id }) => {
        const todo = this.store.select(selectTodoById(id));
        return todo.pipe(
          take(1),
          mergeMap((currentTodo) => {
            if (!currentTodo) return EMPTY;

            this.localStorageService.updateTodo(currentTodo);
            return of(TodoActions.toggleTodoSuccess({ todo: currentTodo }));
          }),
          catchError((error) =>
            of(TodoActions.toggleTodoFailure({ error: error.message }))
          )
        );
      })
    )
  );

  /*
   * @ngrx/effects reorderTodos$
   * Description: Réorganise les todos dans le localStorage
   * Succès: toggleTodoSuccess avec le todo mis à jour
   * Échec: toggleTodoFailure avec le message d'erreur
   */
  reorderTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.reorderTodos),
      withLatestFrom(this.store.select(selectAllTodos)),
      map(([action, allTodos]) => {
        if (!allTodos) {
          throw new Error('Données requises manquantes');
        }

        // Création de nouveaux objets avec la position mise à jour
        const updatedTodos = allTodos.map((todo) => ({
          ...todo,
          position: action.todoIds.indexOf(todo.id),
        }));

        // Vérifie que updatedTodos est valide
        if (!allTodos || !allTodos.length) {
          throw new Error('Aucun todo à mettre à jour');
        }

        this.localStorageService.saveTodos(updatedTodos);
        return TodoActions.reorderTodosSuccess({ todos: updatedTodos });
      }),
      catchError((error) => {
        console.error('Erreur dans reorderTodos$:', error);
        return of(
          TodoActions.updateTodoFailure({
            error: error.message || 'Erreur de réorganisation',
          })
        );
      })
    )
  );
}
