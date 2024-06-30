import React from "react";
import { Pie, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

// Function to extract activity statistics
const getActivityStatistics = (data) => {
  const activityCounts = {};
  const dateCounts = {};

  Object.keys(data).forEach((date) => {
    Object.keys(data[date]).forEach((activity) => {
      if (!activityCounts[activity]) {
        activityCounts[activity] = 0;
      }
      activityCounts[activity] += Object.keys(data[date][activity]).length;

      if (!dateCounts[date]) {
        dateCounts[date] = 0;
      }
      dateCounts[date] += Object.keys(data[date][activity]).length;
    });
  });

  return { activityCounts, dateCounts };
};

// Generate chart data
const generatePieChartData = (activityCounts) => {
  return {
    labels: Object.keys(activityCounts),
    datasets: [
      {
        data: Object.values(activityCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };
};

const generateLineChartData = (dateCounts) => {
  return {
    labels: Object.keys(dateCounts),
    datasets: [
      {
        label: "Attendance Over Time",
        data: Object.values(dateCounts),
        fill: false,
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
      },
    ],
  };
};

const StatisticReport = ({ attendanceData }) => {
  const { activityCounts, dateCounts } = getActivityStatistics(attendanceData);
  const pieChartData = generatePieChartData(activityCounts);
  const lineChartData = generateLineChartData(dateCounts);

  return (
    <div>
      <h2>Attendance Statistics</h2>
      <div style={{ width: "45%", display: "inline-block", margin: "2%" }}>
        <h3>Activity Distribution</h3>
        <Pie data={pieChartData} />
      </div>
      <div style={{ width: "45%", display: "inline-block", margin: "2%" }}>
        <h3>Attendance Over Time</h3>
        <Line data={lineChartData} />
      </div>
    </div>
  );
};

export default StatisticReport;
