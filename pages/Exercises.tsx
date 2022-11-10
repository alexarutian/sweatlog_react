import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import CustomIcon from "../components/CustomIcon";
import CustomText from "../components/CustomText";
import Gap from "../components/Gap";
import IndexCard from "../components/IndexCard";
import { AppStore } from "../stores/appStore";
import { Exercise } from "../stores/types";
import { universalStyles } from "../utilities/stylevars";

const Exercises = () => {
  const { state, dispatch } = React.useContext(AppStore);

  const [selectedExercise, setSelectedExercise] = React.useState<Exercise>();

  const selectedExerciseTitle = (
    <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", padding: 5 }}>
      <CustomText bold style={{ textTransform: "uppercase", padding: 5 }}>
        {selectedExercise?.name || "TITLE"}
      </CustomText>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flexStart" }}>
        <View
          style={{
            height: 21,
            minWidth: 50,
            borderRadius: 5,
            paddingHorizontal: 5,
            backgroundColor: "rgba(60, 73, 63, 0.1)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <CustomText fontSize={12} color={"#3C493F"}>
            {selectedExercise?.equipment_type?.name}
          </CustomText>
        </View>
        <View
          style={{
            height: 21,
            minWidth: 50,
            borderRadius: 5,
            paddingHorizontal: 5,
            backgroundColor: "rgba(60, 73, 63, 0.1)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <CustomText fontSize={12} color={"#3C493F"}>
            {selectedExercise?.exercise_type?.name}
          </CustomText>
        </View>
      </View>
    </View>
  );

  const selectedExerciseDetails = [
    <View style={{ minHeight: 30, padding: 5 }}>
      <CustomText color={"#3C493F"} italic>
        {selectedExercise?.description || "No description yet..."}
      </CustomText>
    </View>,
    <View style={{ height: 30, padding: 5 }}>
      <CustomText color={"#3C493F"}>Used in 5 workouts and 25 sessions</CustomText>
    </View>,
    <View
      style={{
        height: 45,
        padding: 5,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <CustomIcon
        name="plus-thick"
        iconProvider="MaterialCommunityIcons"
        color="rgba(60, 73, 63, 0.3)"
        iconSize={34}
        style={{ padding: 5, marginHorizontal: 5 }}
      />
      <CustomIcon
        name="edit"
        iconProvider="MaterialIcons"
        color="rgba(60, 73, 63, 0.3)"
        iconSize={30}
        style={{ padding: 5, marginHorizontal: 5 }}
      />
      <CustomIcon
        name="trash-can"
        iconProvider="MaterialCommunityIcons"
        color="rgba(60, 73, 63, 0.3)"
        iconSize={30}
        style={{ padding: 5, marginLeft: 5 }}
      />
    </View>,
  ];

  if (!state.exerciseLoaded) {
    return null;
  } else {
    return (
      <View style={universalStyles.page}>
        <Gap height={20} />
        <View style={styles.exerciseList}>
          {state.exerciseLookup.list.map((exercise: Exercise, idx: number) => (
            <View key={idx} style={styles.exerciseItem}>
              <Pressable
                onPress={() => {
                  if (exercise == selectedExercise) {
                    setSelectedExercise(undefined);
                  } else {
                    setSelectedExercise(exercise);
                  }
                }}
              >
                <CustomText
                  color={"#3C493F"}
                  bold={exercise == selectedExercise ? true : false}
                  fontSize={exercise == selectedExercise ? 16 : 14}
                >
                  {exercise.name}
                </CustomText>
              </Pressable>
            </View>
          ))}
        </View>
        <IndexCard
          cardStyle={{ position: "absolute", bottom: 10 }}
          title={selectedExerciseTitle}
          rows={selectedExerciseDetails}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  exerciseList: { width: "100%", alignItems: "flex-start" },
  exerciseItem: { flexDirection: "column", justifyContent: "flex-start", width: "100%", margin: 5 },
  dividingLine: { width: "100%", height: 1, backgroundColor: "gray" },
});

export default Exercises;
