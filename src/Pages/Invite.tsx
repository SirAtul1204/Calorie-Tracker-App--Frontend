import { ThemeProvider } from "@emotion/react";
import { Box, Fab, Grid, Paper, TextField, Typography } from "@mui/material";
import { FC, useState } from "react";
import Nav from "../Components/Nav.component";
import { theme } from "../MaterialTheme";
import { Service } from "../Services/Service";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../Actions/Snackbar.action";

const Invite: FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const dispatch = useDispatch();

  const handleInvite = async (e: any) => {
    try {
      e.preventDefault();
      console.log(name, email);
      if (!name || !email) throw new Error("Name and Email required");
      if (!email.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/))
        throw new Error("Not a valid email");

      dispatch(showSnackbar("info", "Generating token and password"));
      const response = await Service.inviteFriend({ name, email });
      console.log(response.data);
      setGeneratedToken(response.data.token);
      setGeneratedPassword(response.data.password);
      dispatch(showSnackbar("success", "Friend Invited"));
      setName("");
      setEmail("");
    } catch (e: any) {
      // alert(e.message);
      dispatch(showSnackbar("error", e.message));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ bgcolor: "#efefef", pb: 5, minHeight: "100vh" }}
      >
        <Grid item alignSelf="stretch" flex="0.9">
          <Nav />
        </Grid>
        <Grid item justifySelf="center" flex="1">
          <Paper elevation={10}>
            <Box sx={{ py: 3, px: 5 }}>
              <form>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  rowSpacing={2}
                >
                  <Grid item container alignItems="center">
                    <Typography sx={{ mr: 2 }} variant="body2">
                      Name
                    </Typography>
                    <TextField
                      label="Name"
                      required
                      variant="filled"
                      size="small"
                      value={name}
                      onChange={(e) => setName(e.target.value.trimStart())}
                    />
                  </Grid>
                  <Grid item container alignItems="center">
                    <Typography sx={{ mr: 2 }} variant="body2">
                      Email
                    </Typography>
                    <TextField
                      label="Email"
                      required
                      variant="filled"
                      size="small"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.trim())}
                    />
                  </Grid>
                  <Grid item alignSelf="center">
                    <Fab
                      type="submit"
                      color="primary"
                      variant="extended"
                      sx={{
                        transition: "all 0.2s ease-in",
                        "&:hover": {
                          transform: "translateY(-0.25rem)",
                        },
                      }}
                      onClick={handleInvite}
                    >
                      Invite
                    </Fab>
                  </Grid>
                  {generatedToken && generatedPassword && (
                    <Grid item alignSelf="center">
                      <Typography sx={{ width: 300, wordWrap: "break-word" }}>
                        <strong>Token:</strong> {generatedToken}
                      </Typography>
                      <Typography>
                        <strong>Password:</strong> {generatedPassword}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </form>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Invite;
