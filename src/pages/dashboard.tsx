import { createStyles, Container, Title, Text, Button } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { DataTable } from "../comps/DataTable";
import { useStore } from "../store";

const useStyles = createStyles((theme) => ({
  root: {
    height: "100%",
    backgroundSize: "cover",
    backgroundColor: "#11284b",
    backgroundPosition: "center",
    paddingTop: theme.spacing.xl * 1,
    paddingBottom: theme.spacing.xl * 1,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",

    [theme.fn.smallerThan("md")]: {
      flexDirection: "column",
    },
  },

  image: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  content: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    marginRight: theme.spacing.xl * 1,

    [theme.fn.smallerThan("md")]: {
      marginRight: 0,
    },
  },

  control: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 14,

    [theme.fn.smallerThan("md")]: {
      width: "100%",
    },
  },
}));

const Dashboard = () => {
  const { classes } = useStyles();
  const [data, setData] = useState<any>([]);
  const { token, getToken, getUser } = useStore((state: any) => state.auth());

  const fetchCourses = async () => {
    const token = getToken();

    const res = await axios.get("/api/fetch_courses", {
      headers: {
        "Content-Type": "application/json",
        authtoken: token,
      },
    });

    setData(res.data.data);
  };

  return (
    <div className={classes.root}>
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Button
              variant="gradient"
              gradient={{ from: "pink", to: "yellow" }}
              size="md"
              className={classes.control}
              mt={40}
              mb={20}
              onClick={fetchCourses}
            >
              Fetch Courses
            </Button>

            <div>
              <DataTable data={data.eligibleOfferCourses} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
