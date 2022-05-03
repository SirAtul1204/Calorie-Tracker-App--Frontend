import { Add } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Fab,
  Grid,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Popup from "../Components/Popup";
import FoodItem from "../Components/FoodItem.component";
import Nav from "../Components/Nav.component";
import { theme } from "../MaterialTheme";
import { IRootState } from "../Reducers/Root.reducer";
import { Service } from "../Services/Service";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [b, setB] = useState(false);

  const { role, id } = useSelector((state: IRootState) => state.user);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const refresh = () => {
    setB(!b);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const handleBack = () => {
    setPage(page - 1);
  };

  useEffect(() => {
    setIsLoading(true);
    Service.getFoods(page)
      .then((response) => {
        setAllItems(response.data.foodItems);
        setTotalPages(response.data.pageCount);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        alert(e.message);
        setIsLoading(false);
      });
  }, [role, id, page, b]);

  if (isLoading)
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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "#efefef", pb: 5, minHeight: "100vh" }}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          rowSpacing={5}
        >
          <Grid item alignSelf="stretch">
            <Nav />
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              alignItems="stretch"
              justifyContent="center"
              spacing={4}
            >
              {allItems.map((item) => {
                return (
                  <Grid item key={item.id}>
                    <FoodItem
                      id={item.id}
                      calorie={item.calorie}
                      date={item.date}
                      name={item.name}
                      userDailyLimit={item.user.threshold}
                      userId={item.user.id}
                      username={item.user.name}
                      dayTotalCalorie={item.dayTotalCalorie}
                      refresh={refresh}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          <Grid item>
            <Paper sx={{ p: 1 }}>
              <Typography>
                {page} / {totalPages}
              </Typography>
            </Paper>
          </Grid>

          <Grid item>
            <Grid
              container
              spacing={2}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {page !== 1 && (
                <Grid item>
                  <Fab
                    variant="extended"
                    color="primary"
                    onClick={handleBack}
                    sx={{ px: 5 }}
                  >
                    Previous
                  </Fab>
                </Grid>
              )}

              {page !== totalPages && (
                <Grid item>
                  <Fab
                    variant="extended"
                    color="primary"
                    onClick={handleLoadMore}
                    sx={{ px: 5 }}
                  >
                    Next
                  </Fab>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: "1rem", right: "1rem" }}
          onClick={toggleDialog}
        >
          <Add fontSize="medium" titleAccess="Add new food entry" />
        </Fab>

        <Popup
          isOpen={isDialogOpen}
          togglePopup={toggleDialog}
          isAdding={true}
          userId={id}
          refresh={refresh}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Home;
