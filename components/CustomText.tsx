import React from "react";
import {Text, StyleSheet} from "react-native";

type CustomTextProps = {
    fontSize?: number,
    bold?: boolean,
    color?: string,
    children?: any,
    style?: object
}
 
const CustomText = ({fontSize = 14, bold = false, color = "black", children, style}: CustomTextProps) => {
    const styles = makeStyles(fontSize, bold, color)
    return (<Text style={styles.text}>{children}</Text>)
}

const makeStyles = (fontSize: number, isBold: boolean, color: string) => {
    return StyleSheet.create({
        text: {
            fontSize: fontSize,
            fontWeight: isBold ? "bold" : "normal",
            color: color,
        }
    })
}

export default CustomText