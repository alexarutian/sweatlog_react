import React from "react";
import {
    MaterialCommunityIcons,
    Octicons,
    Ionicons,
    MaterialIcons,
    Fontisto,
  } from "@expo/vector-icons";

type CustomIconProps = {
    name: string,
    iconProvider?: IconProvider,
    iconSize?: number,
    color?: string | undefined,
    style?: object,
}

export type IconProvider = "MaterialCommunityIcons" | "Octicons" | "Ionicons" | "MaterialIcons" | "Fontisto"

function getIconProvider(
    providerName: IconProvider = "MaterialCommunityIcons"
  ) {
    switch (providerName) {
      case "Fontisto":
        return Fontisto;
      case "MaterialIcons":
        return MaterialIcons;
      case "Octicons":
        return Octicons;
      case "Ionicons":
        return Ionicons;
      case "MaterialCommunityIcons":
        return MaterialCommunityIcons;
    }
  }
 
const CustomIcon = ({name, iconProvider, iconSize = 24, color = "white", style}: CustomIconProps) => {
    const IconProviderComponent = getIconProvider(iconProvider);

    return (      
    <IconProviderComponent
        // @ts-ignore
        name={name}
        size={iconSize}
        color={color}
        style={style}
      />
)
}


export default CustomIcon