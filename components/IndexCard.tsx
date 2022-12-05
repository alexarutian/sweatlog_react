import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import CustomText from "../components/CustomText";
import { colors } from "../utilities/stylevars";
import CustomIcon from "./CustomIcon";

type IndexCardProps = {
  title: string | React.ReactElement;
  titleStyle?: object;
  /*Either an array for rows of the index card, or a single element that represents the body*/
  rows?: React.ReactElement[];
  body?: React.ReactElement
  cardStyle?: object;
  closeButton?: boolean;
  closeButtonOnPress?: () => void;
  noBodyLines?: boolean;
};

const IndexCard = (props: IndexCardProps) => {
  const { title, titleStyle, rows, cardStyle, closeButton, closeButtonOnPress, noBodyLines = false, body } = props;

  return (
    <View style={[styles.agendaCard, cardStyle]}>
      {closeButton && (
        <Pressable
          onPress={closeButtonOnPress}
          style={{ position: "absolute", top: 5, right: 5, height: 25, width: 25 }}
        >
          <CustomIcon iconProvider="Ionicons" name="close" color={colors.redTheme} />
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
      {rows && rows.map((row: React.ReactElement, idx: number) => (
        <View key={idx}>
          {row}
          {idx < rows.length - 1 && !noBodyLines && <View style={styles.dividingLine}></View>}
        </View>
      ))}
      {body && body}
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
  redDividingLine: { width: "100%", height: 1, backgroundColor: colors.redTheme },
  dividingLine: { width: "100%", height: 1, backgroundColor: colors.blueTheme, opacity: 0.45 },
});

export default IndexCard;
