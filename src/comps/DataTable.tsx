import { useState } from "react";
import { createStyles, Table, ScrollArea } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

interface TableScrollAreaProps {
  data: {
    coOfferCourseId: string;
    section: string;
    timeSlot: string;
    enrolled: string;
    capacity: string;
    creditHour: string;
    courseName: string;
    facualtyName: string;
  }[];
}

export function DataTable({ data }: TableScrollAreaProps) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const rows =
    data &&
    data.map((row, index) => (
      <tr key={index}>
        <td>{row.coOfferCourseId}</td>
        <td>{row.section}</td>
        <td>{row.timeSlot}</td>
        <td>{row.enrolled}</td>
        <td>{row.capacity}</td>
        <td>{row.creditHour}</td>
        <td>{row.courseName}</td>
        <td>{row.facualtyName}</td>
      </tr>
    ));

  return (
    <ScrollArea sx={{ height: 300 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table sx={{ minWidth: "1100px" }}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>Course</th>
            <th>Section</th>
            <th>Time</th>
            <th>Enrolled</th>
            <th>Capacity</th>
            <th>Credit</th>
            <th>Title</th>
            <th>Faculty</th>
          </tr>
        </thead>
        <tbody
          style={{
            color: "white",
          }}
        >
          {rows}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
