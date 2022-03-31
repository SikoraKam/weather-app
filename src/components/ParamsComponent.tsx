import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ParamsComponentProps = {
  max: number;
  min: number;
  mean: number;
  mode: number;
};

export const ParamsComponent: React.FC<ParamsComponentProps> = ({
  max,
  mean,
  min,
  mode,
}) => {
  const renderValue = (valueName: string, value: number) => (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{valueName}</Text>
      <Text style={{ fontWeight: "bold" }}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderValue("maximum:", max)}
      {renderValue("minimum:", min)}
      {renderValue("mode:", mode)}
      {renderValue("mean: ", mean)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginVertical: 8,
  },
});
