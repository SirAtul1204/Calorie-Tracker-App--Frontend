import { Avatar, Button, Grid } from "@mui/material";
import { FC } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { IRootState } from "../Reducers/Root.reducer";

const Nav: FC = () => {
  const { role } = useSelector((state: IRootState) => state.user);

  const location = useLocation();
  const navigate = useNavigate();

  const routeToInvite = () => {
    navigate("/invite");
  };

  const routeToHome = () => {
    navigate("/");
  };

  const routeToReport = () => {
    navigate("/report");
  };

  return (
    <Grid
      container
      sx={{ bgcolor: "primary.main", color: "#efefef", px: 2, py: 1 }}
      alignItems="center"
      justifyContent="space-between"
    >
      <Grid item>
        <Avatar>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: "100%", cursor: "pointer" }}
            onClick={routeToHome}
          />
        </Avatar>
      </Grid>
      <Grid item>
        <Grid container spacing={4}>
          {location.pathname !== "/" && (
            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                size="small"
                onClick={routeToHome}
              >
                Home
              </Button>
            </Grid>
          )}
          {location.pathname !== "/invite" && (
            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                size="small"
                onClick={routeToInvite}
              >
                Invite
              </Button>
            </Grid>
          )}
          {role === "ADMIN" && location.pathname !== "/report" && (
            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                size="small"
                onClick={routeToReport}
              >
                Report
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Nav;
