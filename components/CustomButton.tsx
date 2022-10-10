import React from "react";
import { Text, StyleSheet, Pressable, ViewProps } from "react-native";
import CustomText from "./CustomText";

type CustomButtonProps = {
  onPress: () => void;
  buttonColor?: string;
  style?: ViewProps["style"];
  children?: any;
};

const CustomButton = (props: CustomButtonProps) => {
  const { buttonColor = "green", children, onPress, style } = props;
  const styles = makeStyles(buttonColor);
  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      {children}
    </Pressable>
  );
};

const makeStyles = (buttonColor: string) => {
  return StyleSheet.create({
    button: {
      backgroundColor: buttonColor,
      minWidth: 100,
      height: 30,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
    },
  });
};

export default CustomButton;
