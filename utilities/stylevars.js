import { StyleSheet } from "react-native";

const goldColor = "#D58A24";
const redColor = "#BA1B10";
const greenColor = "#525B2C";
const beigeColor = "#F0D2A8";
const lightBeigeColor = "#F9EDDC";
const grayColor = "#D6D6D6";
const offWhite = "#FCF6EE";

// coolor themes
const blueTheme = "#8DA9C4";
const greenTheme = "#59A96A";
const darkGreenTheme = "#3C493F";
const redTheme = "#B97375";
const transparentGreenTheme = "rgba(60, 73, 63, 0.3)";
const moreTransparentGreenTheme = "rgba(60, 73, 63, 0.1)";
const lightGrayTheme = "#e9e9e9";

export const colors = {
  goldColor,
  redColor,
  greenColor,
  beigeColor,
  lightBeigeColor,
  grayColor,
  offWhite,
  blueTheme,
  darkGreenTheme,
  redTheme,
  transparentGreenTheme,
  moreTransparentGreenTheme,
  lightGrayTheme,
  greenTheme,
};

export const leftFlexColumn = {
  flexDirection: "column",
  justifyContent: "flex-start",
};

export const universalStyles = StyleSheet.create({
  page: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },
  centeredScrollView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});
