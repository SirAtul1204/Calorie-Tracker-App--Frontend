import CloseIcon from "@mui/icons-material/Close";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Box, Button, Grid, Paper, Tooltip, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../Reducers/Root.reducer";
import { Service } from "../Services/Service";
import Popup from "./Popup";
import { showSnackbar } from "../Actions/Snackbar.action";

export interface FoodItemProps {
  name: string;
  id: number;
  calorie: number;
  date: string;
  userId: string;
  username: string;
  userDailyLimit: number;
  dayTotalCalorie: number;
  refresh: () => void;
}

const FoodItem: FC<FoodItemProps> = ({
  name,
  id,
  calorie,
  date,
  userId,
  username,
  userDailyLimit,
  dayTotalCalorie,
  refresh,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { role } = useSelector((state: IRootState) => state.user);

  const dispatch = useDispatch();

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleFoodDelete = async () => {
    try {
      if (
        !window.confirm(
          "You are going to delete this item. Are you sure about this"
        )
      )
        return;
      console.log("Deleting ", id);
      await Service.removeFood(id);
      dispatch(showSnackbar("success", "Item Deleted"));
      refresh();
    } catch (e: any) {
      console.log(e);
      // alert(e.message);
      dispatch(showSnackbar("error", e.message));
    }
  };

  return (
    <Box>
      <Paper
        elevation={10}
        sx={{
          bgcolor: "#efefef",
          width: 300,
          py: 1,
          px: 1,
          position: "relative",
        }}
      >
        <Grid container direction="column" rowSpacing={1}>
          <Grid item>
            <img
              style={{ width: 280, height: 158, borderRadius: "3px" }}
              src={`https://source.unsplash.com/random/280×158/?${name}`}
              alt="food_image"
            />
          </Grid>
          <Grid item>
            <Typography variant="h6" lineHeight={1}>
              {name}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="overline" lineHeight={1}>
              <strong>Calories:</strong> {calorie}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="overline" lineHeight={1}>
              <strong>Date:</strong> {new Date(date).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="overline" lineHeight={1}>
              <strong>Time:</strong> {new Date(date).toLocaleTimeString()}
            </Typography>
          </Grid>
          {role === "ADMIN" && (
            <Grid item>
              <Typography variant="overline" lineHeight={1}>
                <strong>User ID:</strong> {userId}
              </Typography>
            </Grid>
          )}
          {role === "ADMIN" && (
            <Grid item>
              <Typography
                variant="overline"
                lineHeight={1}
                sx={{ textTransform: "none" }}
              >
                <strong>USER'S NAME:</strong> {username}
              </Typography>
            </Grid>
          )}
          {role === "ADMIN" && (
            <Grid item>
              <Typography variant="overline" lineHeight={1}>
                <strong>User's Daily Threshold:</strong> {userDailyLimit}
              </Typography>
            </Grid>
          )}
          <Grid item>
            <Typography
              variant="overline"
              lineHeight={1}
              color={dayTotalCalorie >= userDailyLimit ? "error" : "primary"}
              fontWeight="bold"
            >
              <strong>Day's Total Calorie:</strong> {dayTotalCalorie}
            </Typography>
          </Grid>
          <Grid item alignSelf="stretch">
            <Grid container justifyContent="center" spacing={4}>
              <Grid item>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleFoodDelete}
                  size="small"
                >
                  DELETE
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={togglePopup} size="small">
                  EDIT
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box style={{ position: "absolute", top: 200, right: 25 }}>
          {userDailyLimit > dayTotalCalorie ? (
            <Tooltip title={"Below Threshold"}>
              <DoneAllIcon sx={{ color: "#0f0" }} fontSize="large" />
            </Tooltip>
          ) : (
            <Tooltip title={"Threshold Crossed"}>
              <CloseIcon sx={{ color: "#f00" }} fontSize="large" />
            </Tooltip>
          )}
        </Box>
      </Paper>
      <Popup
        isOpen={isOpen}
        togglePopup={togglePopup}
        userId={userId}
        foodId={id}
        foodName={name}
        isAdding={false}
        date={date}
        refresh={refresh}
        calorie={calorie}
      />
    </Box>
  );
};

export default FoodItem;
