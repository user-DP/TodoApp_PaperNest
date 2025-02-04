import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import * as TodoActions from '../actions/todo.actions';

// Définissons d'abord un type pour le status
type TodoStatus = 'pending' | 'loading' | 'error' | 'success';

export interface TodoState extends EntityState<Todo> {
  error: string | null;
  status: TodoStatus;
}

export const todoAdapter: EntityAdapter<Todo> = createEntityAdapter<Todo>({
  sortComparer: (a: Todo, b: Todo) => {
    // D'abord trier par completed
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Ensuite utiliser la position pour maintenir l'ordre du drag and drop
    return (a.position || 0) - (b.position || 0);
  },
});

export const initialState: TodoState = todoAdapter.getInitialState({
  error: null,
  status: 'pending',
});

export const todoReducer = createReducer(
  initialState,

  /*
   * @ngrx/reducers Load Todos
   * Description: Initialise le chargement des todos
   * Action: Change le statut en 'loading' pour indiquer le chargement en cours
   */
  on(TodoActions.loadTodos, (state) => ({
    ...state,
    status: 'loading' as const,
  })),

  /*
   * @ngrx/reducers Load Todos Success
   * Description: Gère le succès du chargement des todos depuis le storage
   * Action: Met à jour le state avec les todos récupérés et réinitialise les erreurs
   */
  on(TodoActions.loadTodosSuccess, (state, { todos }) =>
    todoAdapter.setAll(todos, {
      ...state,
      status: 'success' as TodoStatus,
      error: null,
    })
  ),

  /*
   * @ngrx/reducers Load Todos Failure
   * Description: Gère l'échec du chargement des todos
   * Action: Enregistre l'erreur dans le state et change le statut en 'error'
   */
  on(TodoActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    error,
    status: 'error' as const,
  })),

  /*
   * @ngrx/reducers Add Todo Success
   * Description: Gère l'ajout réussi d'un nouveau todo
   * Action: Ajoute le todo dans la collection via l'adapter et réinitialise les erreurs
   */
  on(TodoActions.addTodoSuccess, (state, { todo }) =>
    todoAdapter.addOne(todo, { ...state, error: null })
  ),

  /*
   * @ngrx/reducers Add Todo Failure
   * Description: Gère l'échec de l'ajout d'un todo
   * Action: Enregistre l'erreur dans le state et change le statut en 'error'
   */
  on(TodoActions.addTodoFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  /*
   * @ngrx/reducers Update Todo Success
   * Description: Gère la mise à jour réussie d'un todo existant
   * Action: Met à jour le todo spécifié dans la collection via l'adapter
   */
  on(TodoActions.updateTodoSuccess, (state, { todo }) =>
    todoAdapter.updateOne(
      { id: todo.id, changes: todo },
      { ...state, error: null }
    )
  ),

  /*
   * @ngrx/reducers Update Todo Failure
   * Description: Gère l'échec de la mise à jour d'un todo
   * Action: Enregistre l'erreur dans le state et change le statut en 'error'
   */
  on(TodoActions.updateTodoFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  /*
   * @ngrx/reducers Delete Todo Success
   * Description: Gère la suppression réussie d'un todo
   * Action: Supprime le todo spécifié de la collection via l'adapter
   */
  on(TodoActions.deleteTodoSuccess, (state, { id }) =>
    todoAdapter.removeOne(id, { ...state, error: null })
  ),

  /*
   * @ngrx/reducers Delete Todo Failure
   * Description: Gère l'échec de la suppression d'un todo
   * Action: Enregistre l'erreur dans le state et change le statut en 'error'
   */
  on(TodoActions.deleteTodoFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  /*
   * @ngrx/reducers Toggle Todo Success
   * Description: Gère le basculement réussi du statut completed d'un todo
   * Action: Met à jour le statut completed du todo via l'adapter
   */
  on(TodoActions.toggleTodo, (state, { id }) => {
    const todo = state.entities[id];
    if (!todo) return state;

    return todoAdapter.updateOne(
      {
        id,
        changes: {
          completed: !todo.completed,
          updatedAt: new Date(),
        },
      },
      state
    );
  }),

  /*
   * @ngrx/reducers Toggle Todo Failure
   * Description: Gère l'échec du basculement du statut d'un todo
   * Action: Enregistre l'erreur dans le state et change le statut en 'error'
   */
  on(TodoActions.reorderTodos, (state, { todoIds }) => {
    const updates = todoIds.map((id, index) => ({
      id,
      changes: { position: index },
    }));

    return todoAdapter.updateMany(updates, state);
  }),

  on(TodoActions.reorderTodosSuccess, (state, { todos }) => {
    return todoAdapter.setAll(todos, {
      ...state,
      error: null,
    });
  })
);

// Export les sélecteurs générés par l'adapter
export const { selectIds, selectEntities, selectAll, selectTotal } =
  todoAdapter.getSelectors();
