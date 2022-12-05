import React from "react";
import { Text, StyleSheet, TextInput, StyleProp, ViewProps } from "react-native";
import { colors } from "../utilities/stylevars";

type CustomInputProps = {
  fontSize?: number;
  width?: number;
  style?: ViewProps["style"];
  onChangeText?: any,
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  isPassword?: boolean;
  editable?: boolean;
  onFocus?: () => void

};

const CustomInput = ({ fontSize = 16, width = 200, style, onChangeText, value, defaultValue, placeholder, isPassword, editable=true, onFocus }: CustomInputProps) => {
  const styles = makeStyles(fontSize, width);
  return (
    <TextInput
      style={[styles.input, style]}
      clearButtonMode={"always"}
      onChangeText={onChangeText}
      defaultValue={defaultValue}
      value={value}
      placeholder={placeholder}
      selectTextOnFocus={true}
      secureTextEntry={isPassword}
      editable={editable}
      onFocus={onFocus}
    ></TextInput>
  );
};

const makeStyles = (fontSize: number, width: number) => {
  return StyleSheet.create({
    input: {
      fontSize: fontSize,
      backgroundColor: colors.lightGrayTheme,
      borderRadius: 5,
      height: 30,
      width: width,
      padding: 5,
    },
  });
};

export default CustomInput;
