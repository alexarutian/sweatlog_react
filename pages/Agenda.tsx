import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import Gap from "../components/Gap";
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
      <Gap height={20} />
      {agendaDates &&
        agendaDates.map((date: string, idx) => (
          <View key={idx} style={styles.agendaCard}>
            <CustomText fontSize={12} bold style={{ padding: 10, paddingBottom: 5 }}>
              {date}
            </CustomText>
            <View style={styles.redDividingLine}></View>
            {state.sessionList.map(
              (session: Session, idx) =>
                session.date == date && (
                  <>
                    <View
                      key={idx}
                      style={{
                        padding: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <CustomText>{session.workout.name}</CustomText>
                      <CustomButton
                        onPress={() => {
                          alert("starting " + session.workout.name);
                        }}
                        style={{ width: 20, height: 28, backgroundColor: "#8DA9C4" }}
                      >
                        <CustomText fontSize={10} bold color={"white"}>
                          START
                        </CustomText>
                      </CustomButton>
                    </View>
                    {idx < (state.sessionList.length - 1) && <View style={styles.dividingLine}></View>}
                  </>
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

export default Agenda;
