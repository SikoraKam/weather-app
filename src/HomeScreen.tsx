import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import axios from "axios";
import DropDownPicker from "react-native-dropdown-picker";
import { AvailablePlaces } from "./constants/availablePlaces";
import { DropdownContent } from "./constants/dropdownContent";
import { LineTemperatureChart } from "./components/LineTemperatureChart";
import { IWeatherPayload, TimeOfDay } from "./types/weather";
import { Snackbar, ToggleButton } from "react-native-paper";
import { LineHumidityChart } from "./components/LineHumidityChart";

const API_URL = "https://api.openweathermap.org/data/2.5/onecall?";
const API_KEY = "7610daa08efc4e85602d93d01f52f56e";

export const HomeScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>(
    AvailablePlaces.KRAKOW.name
  );
  const [weather, setWeather] = useState<IWeatherPayload>();
  const [toggleValue, setToggleValue] = React.useState<string>(TimeOfDay.DAY);

  useEffect(() => {
    (async () => {
      const weather = await getWeather(
        AvailablePlaces.KRAKOW.lat,
        AvailablePlaces.KRAKOW.long
      );
      setWeather(weather);
    })();
  }, []);

  const getWeather = async (lat: number, long: number) => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        `${API_URL}lat=${lat}&lon=${long}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
      );
      setIsLoading(false);
      return result.data;
    } catch (e) {
      console.warn(e);
    }
    setIsLoading(false);
  };

  const onSelectCity = async (item: any) => {
    setSelectedCity(item.value);
    let selectedCityValue: any = null;
    Object.entries(AvailablePlaces).forEach(([key, value]) => {
      if (value.name === item.value) selectedCityValue = value;
    });
    if (!selectedCityValue || !selectedCityValue.lat) return;

    const weather = await getWeather(
      selectedCityValue?.lat,
      selectedCityValue?.long
    );
    setWeather(weather);
  };

  if (isLoading) return <ActivityIndicator size="large" color="#afe1f1" />;
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={isDropDownOpen}
            value={selectedCity}
            items={DropdownContent}
            setOpen={setIsDropDownOpen}
            multiple={false}
            setValue={() => null}
            onSelectItem={onSelectCity}
            listMode="MODAL"
          />
        </View>

        {weather ? (
          <LineTemperatureChart weather={weather} timeOfDay={toggleValue} />
        ) : (
          <Text>Choose city</Text>
        )}

        <ToggleButton.Row
          style={{ alignSelf: "center", marginVertical: 16 }}
          onValueChange={(value) => setToggleValue(value)}
          value={toggleValue}
        >
          <ToggleButton icon="weather-sunset-up" value={TimeOfDay.MORN} />
          <ToggleButton icon="weather-sunny" value={TimeOfDay.DAY} />
          <ToggleButton icon="weather-night" value={TimeOfDay.NIGHT} />
        </ToggleButton.Row>

        {weather && <LineHumidityChart weather={weather} />}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 50 },
  dropdownContainer: { marginHorizontal: 12, marginBottom: 10 },
});
