import { FC } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../Reducers/Root.reducer";
import { hideSnackbar } from "../Actions/Snackbar.action";

const CustomSnackbar: FC = () => {
  const { isOpen, msg, status } = useSelector(
    (state: IRootState) => state.snackbar
  );

  const dispatch = useDispatch();

  const handleSnackBarClose = () => {
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={1500}
      onClose={handleSnackBarClose}
    >
      <Alert severity={status}>{msg}</Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
