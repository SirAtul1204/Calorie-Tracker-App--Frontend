import { AlertColor } from "@mui/material";

export interface TSnackbarState {
  isOpen: boolean;
  status: AlertColor;
  msg: string;
}

const initialState: TSnackbarState = {
  isOpen: false,
  status: "success",
  msg: "",
};

export const SnackbarReducer = (state = initialState, action: any) => {
  let newState = { ...state };
  switch (action.type) {
    case "SHOW_SNACKBAR":
      newState.isOpen = true;
      newState.status = action.payload.status;
      newState.msg = action.payload.msg;
      break;
    case "HIDE_SNACKBAR":
      newState.isOpen = false;
      break;
    default:
      break;
  }
  return newState;
};
