import { AlertColor } from "@mui/material";

export const showSnackbar = (status: AlertColor, msg: string) => {
  return {
    type: "SHOW_SNACKBAR",
    payload: {
      status,
      msg,
    },
  };
};

export const hideSnackbar = () => {
  return {
    type: "HIDE_SNACKBAR",
  };
};
