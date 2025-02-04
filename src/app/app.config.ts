import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  CheckSquare,
  Edit,
  GripVertical,
  ListTodo,
  LucideAngularModule,
  Search,
  Trash2,
} from 'lucide-angular';

import { routes } from './app.routes';
import { todoReducer } from './store/reducers/todo.reducers';
import { TodoEffects } from './store/effects/todo.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      todos: todoReducer,
    }),
    provideEffects([TodoEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
    }),
    importProvidersFrom(
      LucideAngularModule.pick({
        GripVertical,
        Edit,
        Search,
        Trash2,
        ListTodo,
        CheckSquare,
      })
    ),
  ],
};
