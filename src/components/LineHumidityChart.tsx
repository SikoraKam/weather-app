import React, { useMemo } from "react";
import { IWeatherPayload, TimeOfDay } from "../types/weather";
import { LineChart as LineChartUI } from "react-native-chart-kit";
import { Dimensions, ScrollView } from "react-native";
import { getDateFromTimestamp } from "../utils/getDate";

type LineChartProps = {
  weather: IWeatherPayload;
};
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

export const LineHumidityChart: React.FC<LineChartProps> = ({ weather }) => {
  const humidityData = useMemo(() => {
    return weather.daily.map((day) => day.humidity);
  }, [weather]);

  const labels = useMemo(() => {
    return weather.daily.map((day) => getDateFromTimestamp(day.dt));
  }, [weather]);

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
    <ScrollView horizontal>
      <LineChartUI
        data={chartData}
        width={screenWidth * 1.4}
        height={screenHeight * 0.4}
        chartConfig={{
          backgroundColor: "#e4cfef",
          backgroundGradientFrom: "#e0c7f3",
          backgroundGradientTo: "#c3a1f5",
          decimalPlaces: 1,
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
  );
};
