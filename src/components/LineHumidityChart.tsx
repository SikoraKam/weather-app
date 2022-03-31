import React, { useMemo, useState } from "react";
import { IWeatherPayload, TimeOfDay } from "../types/weather";
import { LineChart as LineChartUI } from "react-native-chart-kit";
import { Dimensions, ScrollView } from "react-native";
import { getDateFromTimestamp } from "../utils/getDate";
import { calculateMode } from "../utils/mode";
import { ParamsComponent } from "./ParamsComponent";
import { Snackbar } from "react-native-paper";

type LineChartProps = {
  weather: IWeatherPayload;
};
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

export const LineHumidityChart: React.FC<LineChartProps> = ({ weather }) => {
  const [isSnackbarVisible, setIsSnackBarVisible] = useState(false);
  const [snackValue, setSnackValue] = useState(0);

  const humidityData = useMemo(() => {
    const dailyHumidity = weather.daily.map((day) => day.humidity);
    return dailyHumidity.slice(0, 5);
  }, [weather]);

  const labels = useMemo(() => {
    const dailyLabels = weather.daily.map((day) =>
      getDateFromTimestamp(day.dt)
    );
    return dailyLabels.slice(0, 5);
  }, [weather]);

  const parameters = useMemo(() => {
    const maximum = Math.max(...humidityData);
    const minimum = Math.min(...humidityData);
    const mean = humidityData.reduce((x, y) => x + y, 0) / humidityData.length;
    const mode = calculateMode(humidityData);

    return { max: maximum, min: minimum, mean, mode };
  }, [humidityData]);

  const chartData = useMemo(() => {
    return {
      labels: labels,
      datasets: [
        {
          data: humidityData,

          strokeWidth: 2, // optional
        },
      ],
    };
  }, [humidityData]);

  return (
    <>
      <ScrollView horizontal>
        <LineChartUI
          data={chartData}
          width={screenWidth * 1.3}
          height={screenHeight * 0.4}
          yAxisSuffix="%"
          onDataPointClick={(data) => {
            setSnackValue(data.value);
            setIsSnackBarVisible(true);
          }}
          chartConfig={{
            backgroundColor: "#e4cfef",
            backgroundGradientFrom: "#e0c7f3",
            backgroundGradientTo: "#c3a1f5",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#a270e1",
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
