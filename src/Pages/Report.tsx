import { ThemeProvider } from "@emotion/react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import Nav from "../Components/Nav.component";
import { theme } from "../MaterialTheme";
import { Service } from "../Services/Service";

const Report: FC = () => {
  const [totalAddedEntriesToday, setTotalEntriesAddedToday] = useState<any>();
  const [avgCalorieToday, setAvgCalorieToday] = useState<any>();
  const [totalEntriesAddedThisWeek, setTotalEntriesAddedThisWeek] =
    useState<any>();
  const [avgCalorieThisWeek, setAvgCalorieThisWeek] = useState<any>();
  const [totalEntriesAddedPrevWeek, setTotalEntriesAddedPrevWeek] =
    useState<any>();

  const [avgCaloriePrevWeek, setAvgCaloriePrevWeek] = useState<any>();

  useEffect(() => {
    Service.getReport()
      .then((response) => {
        const { today, thisWeekData, prevWeekData } = response;
        setTotalEntriesAddedToday(today.totalAddedEntries);
        setAvgCalorieToday(today.avgCalorie);
        setTotalEntriesAddedThisWeek(thisWeekData.totalAddedEntries);
        setTotalEntriesAddedPrevWeek(prevWeekData.totalAddedEntries);
        setAvgCalorieThisWeek(thisWeekData.avgCalorie);
        setAvgCaloriePrevWeek(prevWeekData.avgCalorie);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item alignSelf="stretch">
          <Nav />
        </Grid>
        <Grid item>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <ReportCard
              title={"Today"}
              totalEntries={totalAddedEntriesToday}
              avgCalories={avgCalorieToday}
            />
            <ReportCard
              title={"Last Week"}
              totalEntries={totalEntriesAddedThisWeek}
              avgCalories={avgCalorieThisWeek}
            />

            <ReportCard
              title={"Previous Week"}
              totalEntries={totalEntriesAddedPrevWeek}
              avgCalories={avgCaloriePrevWeek}
            />
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Report;

export interface ReportCardProps {
  title: string;
  totalEntries: number;
  avgCalories: number;
}

const ReportCard: FC<ReportCardProps> = ({
  title,
  totalEntries,
  avgCalories,
}) => {
  return (
    <Grid item>
      <Paper sx={{ px: 2, py: 1, width: 350 }} elevation={10}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <Typography
              variant="h6"
              textTransform="uppercase"
              color="primary.main"
              sx={{ textDecoration: "underline" }}
            >
              {title}
            </Typography>
          </Grid>
          <Grid item alignSelf="stretch">
            <List>
              <ListItem divider>
                <ListItemText primary={`Number of entries = ${totalEntries}`} />
              </ListItem>
              <ListItem divider>
                <ListItemText
                  primary={`Average calories per user = ${avgCalories}`}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};
