import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from '../reducers/todo.reducers';
import * as fromTodo from '../reducers/todo.reducers';

// Sélecteur de feature pour accéder à la partie todos du state
export const selectTodoState = createFeatureSelector<TodoState>('todos');

// Sélecteurs dérivés de l'adapter
export const {
  selectIds: selectTodoIds,
  selectEntities: selectTodoEntities,
  selectAll: selectAllTodos,
  selectTotal: selectTodoTotal,
} = fromTodo.todoAdapter.getSelectors(selectTodoState);

// Sélecteur pour le statut de chargement
export const selectTodoStatus = createSelector(
  selectTodoState,
  (state: TodoState) => state.status
);

// Sélecteur pour les erreurs
export const selectTodoError = createSelector(
  selectTodoState,
  (state: TodoState) => state.error
);

// Sélecteur pour les todos complétés
export const selectCompletedTodos = createSelector(selectAllTodos, (todos) =>
  todos.filter((todo) => todo.completed)
);

// Sélecteur pour les todos non complétés
export const selectActiveTodos = createSelector(selectAllTodos, (todos) =>
  todos.filter((todo) => !todo.completed)
);

// Sélecteur pour rechercher un todo par ID
export const selectTodoById = (id: string) =>
  createSelector(selectTodoEntities, (entities) => entities[id]);

// Sélecteur pour la recherche de todos (bonus feature)
export const selectFilteredTodos = (searchTerm: string) =>
  createSelector(selectAllTodos, (todos) =>
    todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
