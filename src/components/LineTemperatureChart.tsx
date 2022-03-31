import React, { useMemo, useState } from "react";
import { IWeatherPayload, TimeOfDay } from "../types/weather";
import { LineChart as LineChartUI } from "react-native-chart-kit";
import { Dimensions, ScrollView, View } from "react-native";
import { getDateFromTimestamp } from "../utils/getDate";
import { calculateMode } from "../utils/mode";
import { ParamsComponent } from "./ParamsComponent";
import { Snackbar } from "react-native-paper";

type LineChartProps = {
  weather: IWeatherPayload;
  timeOfDay: TimeOfDay;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

export const LineTemperatureChart: React.FC<LineChartProps> = ({
  weather,
  timeOfDay,
}) => {
  const [isSnackbarVisible, setIsSnackBarVisible] = useState(false);
  const [snackValue, setSnackValue] = useState(0);

  const temperatureData = useMemo(() => {
    const dailyTemp = weather.daily.map(
      (day) => Math.round(day.temp[timeOfDay] * 2) / 2
    );
    return dailyTemp.slice(0, 5);
  }, [weather, timeOfDay]);

  const parameters = useMemo(() => {
    const maximum = Math.max(...temperatureData);
    const minimum = Math.min(...temperatureData);
    const mean =
      temperatureData.reduce((x, y) => x + y, 0) / temperatureData.length;
    const mode = calculateMode(temperatureData);

    return { max: maximum, min: minimum, mean, mode };
  }, [temperatureData]);

  const labels = useMemo(() => {
    const dailyLabels = weather.daily.map((day) =>
      getDateFromTimestamp(day.dt)
    );
    return dailyLabels.slice(0, 5);
  }, [weather]);

  const chartData = useMemo(() => {
    return {
      labels: labels,
      datasets: [
        {
          data: temperatureData,
          strokeWidth: 2,
        },
      ],
    };
  }, [temperatureData]);

  return (
    <>
      <ScrollView horizontal>
        <LineChartUI
          data={chartData}
          width={screenWidth * 1.3}
          height={screenHeight * 0.4}
          onDataPointClick={(data) => {
            setSnackValue(data.value);
            setIsSnackBarVisible(true);
          }}
          yAxisSuffix={"°C"}
          chartConfig={{
            backgroundColor: "#a3ddea",
            backgroundGradientFrom: "#afe1f1",
            backgroundGradientTo: "#70cbe8",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#002af1",
            },
          }}
          bezier
        />
      </ScrollView>

      <ParamsComponent
        max={parameters.max}
        min={parameters.min}
        mean={parameters.mean}
        mode={parameters.mode}
      />

      <Snackbar
        wrapperStyle={{
          position: "absolute",
          top: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
        visible={isSnackbarVisible}
        duration={1000}
        onDismiss={() => setIsSnackBarVisible(false)}
      >
        {snackValue}
      </Snackbar>
    </>
  );
};
