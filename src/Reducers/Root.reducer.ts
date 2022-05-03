import { combineReducers } from "redux";
import { UserReducer } from "./User.reducer";
import { SnackbarReducer } from "./Snackbar.reducer";

export const rootReducer = combineReducers({
  user: UserReducer,
  snackbar: SnackbarReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
