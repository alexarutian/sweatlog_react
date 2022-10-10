import React from "react";
import { Text, StyleSheet, TextInput, StyleProp, ViewProps } from "react-native";

type CustomInputProps = {
  fontSize?: number;
  width?: number;
  style?: ViewProps["style"];
  onChangeText?: any,
  value?: string;
  placeholder?: string;
  isPassword?: boolean

};

const CustomInput = ({ fontSize = 14, width = 200, style, onChangeText, value, placeholder, isPassword }: CustomInputProps) => {
  const styles = makeStyles(fontSize, width);
  return (
    <TextInput
      style={[styles.input, style]}
      clearButtonMode={"always"}
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
      selectTextOnFocus={true}
      secureTextEntry={isPassword}
    ></TextInput>
  );
};

const makeStyles = (fontSize: number, width: number) => {
  return StyleSheet.create({
    input: {
      fontSize: fontSize,
      backgroundColor: "lightgray",
      borderRadius: 5,
      height: 30,
      width: width,
      padding: 5
    },
  });
};

export default CustomInput;
