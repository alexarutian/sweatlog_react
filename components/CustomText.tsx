import React from "react";
import {Text, StyleSheet} from "react-native";

export type CustomTextProps = {
    fontSize?: number,
    bold?: boolean,
    italic?: boolean,
    color?: string,
    children?: any,
    style?: object
}
 
const CustomText = ({fontSize = 14, bold = false, italic = false, color = "#3C493F", children, style}: CustomTextProps) => {
    const styles = makeStyles(fontSize, bold, italic, color)
    return (<Text style={[styles.text, style]}>{children}</Text>)
}

const makeStyles = (fontSize: number, isBold: boolean, isItalic: boolean, color: string) => {
    return StyleSheet.create({
        text: {
            fontSize: fontSize,
            fontStyle: isItalic ? "italic" : undefined,
            fontWeight: isBold ? "bold" : "normal",
            color: color,
            fontFamily: isBold? "InterBold" : "Inter"
        }
    })
}

export default CustomText