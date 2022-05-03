import { ThemeProvider } from "@emotion/react";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../Actions/User.action";
import { theme } from "../MaterialTheme";
import { IRootState } from "../Reducers/Root.reducer";
import { TRole } from "../Reducers/User.reducer";
import { Service } from "../Services/Service";
import { token } from "../Constants";
import Nav from "./Nav.component";

export interface AuthProps {
  roles: TRole[];
  element: FC;
}

interface IRestricted {
  src: string;
}

const Restricted: FC<IRestricted> = ({ src }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Paper elevation={10}>
        <img
          src={src}
          alt={"unauthorized"}
          style={{ width: "500px", borderRadius: "5px" }}
        />
      </Paper>
    </Box>
  );
};

const Auth: FC<AuthProps> = (props) => {
  const [isSpinning, setIsSpinning] = useState(true);

  const { role } = useSelector((state: IRootState) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsSpinning(true);
    Service.auth()
      .then((response) => {
        const { id, role, name } = response.data;
        dispatch(updateUser(id, role, name));
        setIsSpinning(false);
      })
      .catch((e) => {
        console.log(e);
        setIsSpinning(false);
      });
  }, [dispatch]);

  if (isSpinning)
    return (
      <ThemeProvider theme={theme}>
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50% -50%)",
          }}
          size={100}
          color="primary"
        />
      </ThemeProvider>
    );

  if (!token) return <Restricted src={"unauthorized.jpg"} />;

  if (!props.roles.includes(role))
    return (
      <Box>
        <Nav />
        <Restricted src={"forbidden.jpg"} />
      </Box>
    );

  return <>{<props.element />}</>;
};

export default Auth;
