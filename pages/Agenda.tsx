import React, { useCallback, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Calendar, CalendarList, DateData } from "react-native-calendars";
import CustomButton from "../components/CustomButton";
import CustomIcon from "../components/CustomIcon";
import CustomText from "../components/CustomText";
import Gap from "../components/Gap";
import IndexCard from "../components/IndexCard";
import { AppStore } from "../stores/appStore";
import { Session, Workout } from "../stores/types";
import { universalStyles } from "../utilities/stylevars";

const Agenda = () => {
  const { state, dispatch } = React.useContext(AppStore);

  const today = new Date();

  const [addingSession, setAddingSession] = React.useState(false);
  const [agendaDates, setAgendaDates] = React.useState([""]);
  const [selectedWorkout, setSelectedWorkout] = React.useState<Workout>();
  const [selectedDate, setSelectedDate] = React.useState(today.toDateString());

  const clearAddFields = () => {
    setSelectedWorkout(undefined)
    setSelectedDate(today.toDateString())
  }

  const findAllDates = () => {
    let dateList: string[] = [];
    for (let session of state.sessionLookup.list) {
      if (!dateList.includes(session.dateString)) {
        dateList.push(session.dateString);
      }
    }
    dateList.sort();
    setAgendaDates(dateList);
    return;
  };

  useEffect(() => {
    if (state.sessionLookup?.list?.length > 0) {
      findAllDates();
    }
  }, [state.sessionLookup.list]);

  const submitCreate = React.useCallback(() => {
    if (selectedDate && selectedWorkout) {
      dispatch({
        name: "createSession",
        payload: { user_token: state.userToken, date: selectedDate, workout_id: selectedWorkout.id },
        user: state.userId,
      });
    }
    setAddingSession(false);
    clearAddFields()
  }, [selectedDate, selectedWorkout]);

  const addingSessionBody = (
    <View style={{flexDirection: "column", alignItems: "center"}}>
      <Calendar
        style={{ width: 300 }}
        initialDate={selectedDate}
        // initialDate={today.toDateString()}
        onDayPress={(date) => {
          setSelectedDate(date.dateString);
        }}
        theme={{
          arrowColor: "orange",
          textDayFontFamily: "Inter",
          textMonthFontFamily: "Inter",
          textDayHeaderFontFamily: "Inter",
          selectedDayBackgroundColor: "#8DA9C4",
          dayTextColor: "#3C493F",
          monthTextColor: "#3C493F",
          todayTextColor: "#B97375"
        }}
        hideArrows={false}
        renderArrow={(direction) => {
          if (direction == "left")
            return <CustomIcon name="keyboard-arrow-left" iconProvider="MaterialIcons" color="#B97375" />;
          if (direction == "right")
            return <CustomIcon name="keyboard-arrow-right" iconProvider="MaterialIcons" color="#B97375" />;
        }}
      />
      <Gap height={10}/>
              <CustomText fontSize={18} style={{alignSelf: "flex-start", paddingLeft: 10}}>Select a workout: </CustomText>
      <View style={{width: "100%", flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20}}>
      {state.workoutLookup.list &&
        state.workoutLookup.list.map((workout: Workout) => {
          return (
            <CustomButton
              style={{paddingHorizontal: 10, marginHorizontal: 10, marginVertical: 5, borderWidth: 1, borderColor: "#8DA9C4", backgroundColor: (workout == selectedWorkout ? "#8DA9C4" : "white")}}
              onPress={() => {
                setSelectedWorkout(workout);
              }}
              key={workout.name}
            >
              <CustomText>{workout.name}</CustomText>
            </CustomButton>
          );
        })}
        </View>
        <Gap height={20}/>

      <CustomButton onPress={submitCreate} style={{width: 200}}>
        <CustomText bold color="white">Add Session</CustomText>
      </CustomButton>
    </View>
  );

  if (state.sessionLoaded) {
    return (
      <View style={universalStyles.page}>
        <Gap height={20} />
        <CustomButton
          onPress={() => {
            setAddingSession(true);
          }}
          style={{ width: 120 }}
        >
          <CustomText bold color="white">
            Add Session
          </CustomText>
        </CustomButton>
        <ScrollView style={{width: "100%", paddingBottom: 20}}>
        {agendaDates &&
          agendaDates.map((date: string) => {
            return (
              <View key={date} style={styles.agendaCard}>
                <CustomText fontSize={12} bold style={{ padding: 10, paddingBottom: 5 }}>
                  {date}
                </CustomText>
                <View style={styles.redDividingLine}></View>
                {state.sessionLookup.list.map(
                  (session: Session, sidx) =>
                    session.dateString == date && (
                      <React.Fragment key={session.id}>
                        <View
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
                        {sidx < state.sessionList.length - 1 && <View style={styles.dividingLine}></View>}
                      </React.Fragment>
                    )
                )}
              </View>
            );
          })}
          </ScrollView>
        {addingSession && (
          <IndexCard
            cardStyle={{ position: "absolute", height: "100%", width: "100%" }}
            title={"Schedule a session"}
            titleStyle={{ height: 45, fontSize: 20 }}
            body={addingSessionBody}
            closeButton
            closeButtonOnPress={() => {
              setAddingSession(false);
              clearAddFields()
            }}
            noBodyLines
          />
        )}
      </View>
    );
  } else {
    return <></>;
  }
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
