import { createAction, props } from '@ngrx/store';
import { Todo } from '../../models/todo.model';

const ACTION_SCOPE = '[Todo]';

/*
 * @ngrx/actions Load Todo
 * description: Load all todos from local storage
 */
export const loadTodos = createAction(`${ACTION_SCOPE} Load Todos`);
export const loadTodosSuccess = createAction(
  `${ACTION_SCOPE} Load Todos Success`,
  props<{ todos: Todo[] }>()
);
export const loadTodosFailure = createAction(
  '${ACTION_SCOPE} Load Todos Failure',
  props<{ error: string }>()
);

/*
 * @ngrx/actions Add Todo
 * description: Add a new todo to local storage
 */
export const addTodo = createAction(
  `${ACTION_SCOPE} Add Todo`,
  props<{ todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> }>()
);
export const addTodoSuccess = createAction(
  `${ACTION_SCOPE} Add Todo Success`,
  props<{ todo: Todo }>()
);
export const addTodoFailure = createAction(
  `${ACTION_SCOPE} Add Todo Failure`,
  props<{ error: string }>()
);

/*
 * @ngrx/actions Edit Todo
 * description: Edit an existing todo in local storage
 */
export const updateTodo = createAction(
  `${ACTION_SCOPE} Update Todo`,
  props<{ id: string; changes: Partial<Todo> }>()
);
export const startEditTodo = createAction(
  `${ACTION_SCOPE} Start Edit Todo`,
  props<{ id: string }>()
);
export const cancelEditTodo = createAction(`${ACTION_SCOPE} Cancel Edit Todo`);
export const updateTodoSuccess = createAction(
  `${ACTION_SCOPE} Update Todo Success`,
  props<{ todo: Todo }>()
);
export const updateTodoFailure = createAction(
  `${ACTION_SCOPE} Update Todo Failure`,
  props<{ error: string }>()
);

/*
 * @ngrx/actions Delete Todo
 * description: Delete a todo from local storage
 */
export const deleteTodo = createAction(
  `${ACTION_SCOPE} Delete Todo`,
  props<{ id: string }>()
);
export const deleteTodoSuccess = createAction(
  `${ACTION_SCOPE} Delete Todo Success`,
  props<{ id: string }>()
);
export const deleteTodoFailure = createAction(
  `${ACTION_SCOPE} Delete Todo Failure`,
  props<{ error: string }>()
);

/*
 * @ngrx/actions Toggle Todo
 * description: Toggle a todo's complete status
 */
export const toggleTodo = createAction(
  `${ACTION_SCOPE} Toggle Todo Complete`,
  props<{ id: string }>()
);
export const toggleTodoSuccess = createAction(
  `${ACTION_SCOPE} Toggle Todo Complete`,
  props<{ todo: Todo }>()
);
export const toggleTodoFailure = createAction(
  `${ACTION_SCOPE} Toggle Todo Complete`,
  props<{ error: string }>()
);

/*
 * @ngrx/actions Reorder Todo
 * description: Reorder todos in local storage
 */
export const reorderTodos = createAction(
  '[Todo] Reorder Todos',
  props<{ todoIds: string[]; completed: boolean }>()
);

export const reorderTodosSuccess = createAction(
  '[Todo] Reorder Todos Success',
  props<{ todos: Todo[] }>()
);
