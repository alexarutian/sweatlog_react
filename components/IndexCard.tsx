import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import CustomText from "../components/CustomText";
import CustomIcon from "./CustomIcon";

type IndexCardProps = {
  title: string | React.ReactElement;
  titleStyle?: object;
  rows: React.ReactElement[];
  cardStyle?: object;
  closeButton?: boolean;
  closeButtonOnPress?: () => void;
  noBodyLines?: boolean;
};

const IndexCard = (props: IndexCardProps) => {
  const { title, titleStyle, rows, cardStyle, closeButton, closeButtonOnPress, noBodyLines = false } = props;

  return (
    <View style={[styles.agendaCard, cardStyle]}>
      {closeButton && (
        <Pressable
          onPress={closeButtonOnPress}
          style={{ position: "absolute", top: 3, right: 3, height: 25, width: 25 }}
        >
          <CustomIcon iconProvider="Ionicons" name="close" color="red" />
        </Pressable>
      )}
      {typeof title == "string" ? (
        <CustomText fontSize={10} bold style={[{ padding: 10, paddingBottom: 5 }, titleStyle]}>
          {title}
        </CustomText>
      ) : (
        title
      )}
      <View style={styles.redDividingLine}></View>
      {rows.map((row, idx) => (
        <View key={idx}>
          {row}
          {idx < rows.length - 1 && !noBodyLines && <View style={styles.dividingLine}></View>}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  agendaCard: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 6,
    marginTop: 5,
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  redDividingLine: { width: "100%", height: 1, backgroundColor: "#B97375" },
  dividingLine: { width: "100%", height: 1, backgroundColor: "#8DA9C4", opacity: 0.45 },
});

export default IndexCard;
