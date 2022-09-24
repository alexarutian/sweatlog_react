import React from "react";
import { Pressable, StyleSheet } from "react-native";
import CustomIcon from "./CustomIcon";
import { IconProvider } from "../components/CustomIcon";

type FooterProps = {
  navOptions: NavOption[];
  buttonOnClick?: (name: string) => void;
  activePage: string;
};

export type NavOption = {
  name: string;
  iconName: string;
  iconProvider: IconProvider;
};

const Footer = ({ navOptions, buttonOnClick, activePage }: FooterProps) => {
  const styles = makeStyles();
  return (
    <>
      {navOptions.map((option: NavOption, idx: number) => (
        <Pressable
          key={idx}
          onPress={() => {
            if (buttonOnClick) {
              buttonOnClick(option.name);
            }
          }}
        >
          <CustomIcon
            name={option.iconName}
            iconProvider={option.iconProvider}
            iconSize={34}
            color={option.name == activePage ? "yellow" : undefined}
          />
        </Pressable>
      ))}
    </>
  );
};

const makeStyles = () => {
  return StyleSheet.create({
    activePage: {
      color: "yellow",
    },
  });
};

export default Footer;
