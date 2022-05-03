import { TextField } from "@material-ui/core";
import {
  LocalizationProvider,
  MobileDatePicker,
  MobileTimePicker,
} from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import {
  Autocomplete,
  Dialog,
  Fab,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import debounce from "lodash.debounce";
import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../Reducers/Root.reducer";
import { Service } from "../Services/Service";
import { showSnackbar } from "../Actions/Snackbar.action";

export interface PopupProps {
  isOpen: boolean;
  isAdding: boolean;
  userId: string;
  foodId?: number;
  foodName?: string;
  date?: string;
  calorie?: number;
  togglePopup: () => void;
  refresh: () => void;
}

export interface IFoodOptions {
  itemName: string;
  itemCalorie: string;
}

const Popup: FC<PopupProps> = ({
  isOpen,
  isAdding,
  userId,
  foodId,
  foodName,
  date,
  calorie,
  togglePopup,
  refresh,
}) => {
  const [food, setFood] = useState(foodName ? foodName : "");
  const [foodOptions, setFoodOptions] = useState<IFoodOptions[]>([]);
  const [calorieState, setCalorieState] = useState<number>(
    calorie ? calorie : 0.0
  );
  const [selectedDate, setSelectedDate] = useState(
    date ? new Date(date) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState(
    date ? new Date(date) : new Date()
  );
  const [userIdState, setUserIdState] = useState(userId);

  const { role } = useSelector((state: IRootState) => state.user);

  const dispatch = useDispatch();

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time: Date) => {
    setSelectedTime(time);
  };

  const updateFood = (value: string) => {
    // console.log(value);
    setFood(value.trim());
  };

  const handleAddFood = async () => {
    try {
      if (!food || !calorieState || !selectedDate || !selectedTime)
        throw new Error("Fill all required fields");

      if (calorieState < 0 || calorieState > 5000)
        throw new Error("Calories must be greater than 0 and less than 5000");

      const datetime = selectedDate;
      datetime.setHours(selectedTime.getHours());
      datetime.setMinutes(selectedTime.getMinutes());
      datetime.setSeconds(selectedTime.getSeconds());
      console.log(datetime);
      await Service.addFood({
        name: food,
        calorie: calorieState,
        date: datetime.toISOString(),
        userId: userIdState,
      });
      // setSnackbar("Added", "success");
      dispatch(showSnackbar("success", "Added"));
      togglePopup();
      refresh();
    } catch (e: any) {
      dispatch(
        showSnackbar(
          "error",
          e.response?.status ? e.response.data.message : e.message
        )
      );
    }
  };

  const handleFoodUpdate = async () => {
    try {
      if (!foodId || !food || !calorieState || !selectedDate || !selectedTime)
        throw new Error("Fill all required fields");

      if (calorieState < 1 || calorieState > 5000)
        throw new Error("Calories must be greater than 0 and less than 5000o");

      const datetime = selectedDate;
      datetime.setHours(selectedTime.getHours());
      datetime.setMinutes(selectedTime.getMinutes());
      datetime.setSeconds(selectedTime.getSeconds());
      await Service.updateFood({
        //@ts-ignore
        foodId,
        name: food,
        calorie: calorieState,
        date: datetime.toISOString(),
      });
      // setSnackbar("Edited", "success");
      dispatch(showSnackbar("success", "Edited"));
      togglePopup();
      refresh();
    } catch (e: any) {
      // alert(e.message);
      // setSnackbar(e.message, "error");
      dispatch(
        showSnackbar(
          "error",
          e.response?.status ? e.response.data.message : e.message
        )
      );
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(debounce(updateFood, 500), []);

  useEffect(() => {
    if (role === "ADMIN") setUserIdState("");

    if (!food.trim()) return;

    fetch(
      `https://api.nutritionix.com/v1_1/search/${food}?results=0:20&fields=item_name,brand_name,item_id,nf_calories&appId=5c9943d9&appKey=adfbbe11a59625f5ea8b03900bb561ab`,
      {
        method: "GET",
      }
    )
      .then((response) => {
        response
          .json()
          .then((data) => {
            // console.log(data.hits[0].fields);
            const arr: IFoodOptions[] = [];
            data.hits.forEach((hit: any) => {
              arr.push({
                itemName: hit.fields.item_name,
                itemCalorie: hit.fields.nf_calories,
              });
            });
            setFoodOptions(arr);
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));

    if (!isOpen) {
      setFood(foodName ? foodName : "");
      setCalorieState(calorie ? calorie : 0.0);
      setSelectedDate(date ? new Date(date) : new Date());
      setSelectedTime(date ? new Date(date) : new Date());
    }
  }, [food, role, isOpen, isAdding]);

  return (
    <Dialog open={isOpen} onClose={togglePopup}>
      <Paper elevation={10} sx={{ width: 300 }}>
        <Grid
          container
          direction="column"
          alignItems="stretch"
          justifyContent="center"
          sx={{ px: 1, py: 2 }}
          rowSpacing={2}
        >
          <Grid item alignSelf="center">
            <Typography
              variant="overline"
              textAlign={"center"}
              fontWeight="bold"
            >
              {isAdding ? "Add Food Item" : "EDIT"}
            </Typography>
          </Grid>
          <Grid item>
            <Autocomplete
              value={food}
              freeSolo
              options={foodOptions.map(
                (foodOption) =>
                  foodOption.itemName + " -- " + foodOption.itemCalorie + " Cal"
              )}
              size="small"
              onSelect={(e) =>
                setCalorieState(
                  Number(
                    //@ts-ignore
                    (e.target?.value?.split(" "))[
                      //@ts-ignore
                      e.target?.value.split(" ")?.length - 2
                    ]
                  )
                )
              }
              onInputChange={(e, value, changeReason) =>
                debouncedOnChange(String(value))
              }
              renderInput={(params) => (
                <TextField required variant="filled" label="Food" {...params} />
              )}
            />
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <MobileDatePicker
                label="Date"
                //@ts-ignore
                onChange={handleDateChange}
                value={selectedDate}
                maxDate={new Date()}
                renderInput={(params) => (
                  //@ts-ignore
                  <TextField
                    variant="filled"
                    fullWidth
                    size="small"
                    required
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <MobileTimePicker
                label="Time"
                //@ts-ignore
                onChange={handleTimeChange}
                value={selectedTime}
                renderInput={(params) => (
                  //@ts-ignore
                  <TextField
                    variant="filled"
                    fullWidth
                    size="small"
                    required
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              variant="filled"
              label="Calorie"
              size="small"
              type="number"
              required
              value={calorieState}
              onChange={(e) => setCalorieState(parseFloat(e.target.value))}
            />
          </Grid>
          {role === "ADMIN" && isAdding && (
            <Grid item>
              <TextField
                fullWidth
                variant="filled"
                label="User ID"
                size="small"
                value={userIdState}
                onChange={(e) => setUserIdState(e.target.value)}
              />
            </Grid>
          )}
          <Grid item alignSelf="center">
            {isAdding ? (
              <Fab
                variant="extended"
                color="primary"
                sx={{
                  px: 5,
                  transition: "all 0.2s ease-in",
                  "&:hover": {
                    transform: "translateY(-0.25rem)",
                  },
                }}
                onClick={handleAddFood}
              >
                Add
              </Fab>
            ) : (
              <Fab
                variant="extended"
                color="primary"
                sx={{
                  px: 5,
                  transition: "all 0.2s ease-in",
                  "&:hover": {
                    transform: "translateY(-0.25rem)",
                  },
                }}
                onClick={handleFoodUpdate}
              >
                Save
              </Fab>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Dialog>
  );
};

export default Popup;
