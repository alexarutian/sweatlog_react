import { StyleSheet } from "react-native";

const goldColor = "#D58A24";
const redColor = "#BA1B10";
const greenColor = "#525B2C";
const beigeColor = "#F0D2A8";
const lightBeigeColor = "#F9EDDC";
const grayColor = "#D6D6D6";
const offWhite = "#FCF6EE";

export const colors = { goldColor, redColor, greenColor, beigeColor, lightBeigeColor, grayColor, offWhite };

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
});
