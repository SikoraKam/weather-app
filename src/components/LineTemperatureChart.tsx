import React, { useMemo } from "react";
import { IWeatherPayload, TimeOfDay } from "../types/weather";
import { LineChart as LineChartUI } from "react-native-chart-kit";
import { Dimensions, ScrollView } from "react-native";
import { getDateFromTimestamp } from "../utils/getDate";

type LineChartProps = {
  weather: IWeatherPayload;
  timeOfDay: TimeOfDay;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

export const LineTemperatureChart: React.FC<LineChartProps> = ({
  weather,
  timeOfDay,
}) => {
  const temperatureData = useMemo(() => {
    return weather.daily.map((day) => Math.round(day.temp[timeOfDay] * 2) / 2);
  }, [weather, timeOfDay]);

  const labels = useMemo(() => {
    return weather.daily.map((day) => getDateFromTimestamp(day.dt));
  }, [weather]);

  console.log(temperatureData);
  const chartData = useMemo(() => {
    return {
      labels: labels,
      datasets: [
        {
          data: temperatureData,

          strokeWidth: 2, // optional
        },
      ],
    };
  }, [temperatureData]);

  return (
    <ScrollView horizontal>
      <LineChartUI
        data={chartData}
        width={screenWidth * 1.4}
        height={screenHeight * 0.4}
        yAxisSuffix={"°C"}
        chartConfig={{
          backgroundColor: "#a3ddea",
          backgroundGradientFrom: "#afe1f1",
          backgroundGradientTo: "#70cbe8",
          decimalPlaces: 1,
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
  );
};
