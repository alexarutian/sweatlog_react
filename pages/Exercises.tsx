import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import CustomText from "../components/CustomText";
import { AppStore } from "../stores/appStore";
import { Exercise } from "../stores/types";
import { universalStyles } from "../utilities/stylevars";

const Exercises = () => {
  const { state, dispatch } = React.useContext(AppStore);

  const [selectedExercise, setSelectedExercise] = React.useState<Exercise>();

  return (
    <View style={universalStyles.page}>
      <CustomText bold>Exercises</CustomText>
      <View style={styles.exerciseList}>
        {state.exerciseList.map((exercise: Exercise, idx: number) => (
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
              <CustomText fontSize={exercise == selectedExercise ? 16 : 14}>{exercise.name}</CustomText>
            </Pressable>
            {exercise == selectedExercise && (
              <>
                <CustomText color={"gray"}>{exercise.description}</CustomText>
                <CustomText color={"gray"}>{exercise.exercise_type?.name}</CustomText>
                <CustomText color={"gray"}>{exercise.equipment_type?.name}</CustomText>
                <View style={styles.dividingLine}></View>
              </>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseList: { width: "100%", alignItems: "flex-start"},
  exerciseItem: { flexDirection: "column", justifyContent: "flex-start", width: "100%", margin: 5 },
  dividingLine: { width: "100%", height: 1, backgroundColor: "gray" },
});

export default Exercises;
