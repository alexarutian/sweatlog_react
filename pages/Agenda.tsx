import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "../components/CustomText";
import { AppStore } from "../stores/appStore";
import { Session } from "../stores/types";
import { universalStyles } from "../utilities/stylevars";

const Agenda = () => {
  const { state, dispatch } = React.useContext(AppStore);

  const sessionList: Session[] = state.sessionList;
  const [agendaDates, setAgendaDates] = React.useState([""]);

  const findAllDates = () => {
    let dateList: string[] = [];
    for (let s of sessionList) {
      if (!dateList.includes(s.date)) {
        dateList.push(s.date);
      }
    }
    dateList.sort();
    setAgendaDates(dateList);
    return;
  };

  useEffect(() => {
    findAllDates();
  }, [sessionList]);

  return (
    <View style={universalStyles.page}>
      <CustomText bold>Agenda</CustomText>
      {agendaDates &&
        agendaDates.map((date: string, idx) => (
          <View key={idx} style={styles.agendaDate}>
            <CustomText>{date}</CustomText>
            <View style={styles.dividingLine}></View>
            {state.sessionList.map(
              (session: Session, idx) =>
                session.date == date && (
                  <View key={idx}>
                    <CustomText>{session.workout.name}</CustomText>
                  </View>
                )
            )}
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  agendaDate: { width: "95%", backgroundColor: "white", borderRadius: 6, padding: 5, marginTop: 5 },
  dividingLine: { width: "100%", height: 1, backgroundColor: "gray" },
});

export default Agenda;
