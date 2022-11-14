import React, { useEffect } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomIcon from "../components/CustomIcon";
import CustomInput from "../components/CustomInput";
import CustomText from "../components/CustomText";
import Gap from "../components/Gap";
import IndexCard from "../components/IndexCard";
import { AppStore } from "../stores/appStore";
import { EquipmentType, Exercise, ExerciseType } from "../stores/types";
import { universalStyles } from "../utilities/stylevars";

const Exercises = () => {
  const { state, dispatch } = React.useContext(AppStore);

  const [selectedExercise, setSelectedExercise] = React.useState<Exercise>();

  // sets initial value to detailed exercise view
  useEffect(() => {
    if (state.exerciseLookup.list !== undefined) {
      setSelectedExercise(state.exerciseLookup.list[0]);
    }
  }, [state.exerciseLookup.list]);

  const [addingExercise, setAddingExercise] = React.useState(true);

  const selectedExerciseTitle = (
    <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", padding: 5 }}>
      <CustomText bold style={{ textTransform: "uppercase", padding: 5 }}>
        {selectedExercise?.name || "TITLE"}
      </CustomText>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
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

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedExerciseType, setSelectedExerciseType] = React.useState<ExerciseType>();
  const [selectedEquipmentType, setSelectedEquipmentType] = React.useState<EquipmentType>();
  const [isExerciseTypeDropdownOpen, setIsExerciseTypeDropdownOpen] = React.useState(false);
  const [isEquipmentTypeDropdownOpen, setIsEquipmentTypeDropdownOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("")

  const submitExercise = () => {
    if (!name) {
      setErrorMessage("name is required")
      return
    }
    let payload = {name: name, user_token: state.userToken}
    if (description !== undefined) { payload.description = description}
    if (selectedExerciseType !== undefined) {payload.exercise_type_id = selectedExerciseType.id} 
    if (selectedEquipmentType !== undefined) {payload.equipment_type_id = selectedEquipmentType.id} 
    dispatch({name: "createExercise", payload: payload, user: state.userId})
    setAddingExercise(false)

  }

  const addExerciseRows = [
    <View style={{ height: 45, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", padding: 10 }}>
      <CustomInput onChangeText={setName} value={name} placeholder="name" style={{ marginTop: 5 }} />
    </View>,
    <View style={{ height: 45, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", padding: 10 }}>
      <CustomInput
        onChangeText={setDescription}
        value={description}
        placeholder="description"
        style={{ marginTop: 5 }}
      />
    </View>,
    <View style={{ height: 45, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", padding: 10 }}>
      <CustomButton
        buttonColor={"rgba(233, 233, 233, 1)"}
        style={{ width: 200, justifyContent: "space-between", padding: 5 }}
        onPress={() => {
          setIsExerciseTypeDropdownOpen(!isExerciseTypeDropdownOpen);
          isEquipmentTypeDropdownOpen ? setIsEquipmentTypeDropdownOpen(false) : null;
        }}
      >
        <CustomText>{!selectedExerciseType ? "Select Exercise Type" : selectedExerciseType.name}</CustomText>
        <CustomIcon
          iconProvider="Feather"
          name={isExerciseTypeDropdownOpen ? "chevrons-up" : "chevrons-down"}
          color="black"
          iconSize={20}
        />
      </CustomButton>
      {isExerciseTypeDropdownOpen && (
        <View>
          {state.exerciseTypeLookup.list?.length > 0 && (
            <>
              {state.exerciseTypeLookup.list.map((et: ExerciseType, idx: number) => (
                <Pressable
                  onPress={() => {
                    setSelectedExerciseType(et);
                    setIsExerciseTypeDropdownOpen(false);
                  }}
                  key={idx}
                  style={{ height: 25 }}
                >
                  <CustomText>{et.name}</CustomText>
                </Pressable>
              ))}
            </>
          )}
        </View>
      )}
    </View>,
    <View style={{ height: 45, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", padding: 10 }}>
      <CustomButton
        buttonColor={"rgba(233, 233, 233, 1)"}
        style={{ width: 200, justifyContent: "space-between", padding: 5 }}
        onPress={() => {
          setIsEquipmentTypeDropdownOpen(!isEquipmentTypeDropdownOpen);
          isExerciseTypeDropdownOpen ? setIsExerciseTypeDropdownOpen(false) : null;
        }}
      >
        <CustomText>{!selectedEquipmentType ? "Select Equipment Type" : selectedEquipmentType.name}</CustomText>
        <CustomIcon
          iconProvider="Feather"
          name={isEquipmentTypeDropdownOpen ? "chevrons-up" : "chevrons-down"}
          color="black"
          iconSize={20}
        />
      </CustomButton>
      {isEquipmentTypeDropdownOpen && (
        <View>
          {state.equipmentTypeLookup.list?.length > 0 && (
            <>
              {state.equipmentTypeLookup.list.map((et: EquipmentType, idx: number) => (
                <Pressable
                  onPress={() => {
                    setSelectedEquipmentType(et);
                    setIsEquipmentTypeDropdownOpen(false);
                  }}
                  key={idx}
                >
                  <CustomText>{et.name}</CustomText>
                </Pressable>
              ))}
            </>
          )}
        </View>
      )}
    </View>,
        <View style={{ height: 45, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", padding: 10 }}>
          <CustomButton onPress={submitExercise} style={{width: 200}}><CustomText bold color="white">Create exercise</CustomText></CustomButton>
</View>
  ];

  if (!state.exerciseLoaded) {
    return null;
  } else {
    return (
      <View style={universalStyles.page}>
        <Gap height={20} />
        <CustomButton
          onPress={() => {
            setAddingExercise(true);
          }}
          style={{ width: 120 }}
        >
          <CustomText bold color="white">
            Add Exercise
          </CustomText>
        </CustomButton>
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
        {addingExercise && (
          <IndexCard
            cardStyle={{ position: "absolute", height: "100%", width: "100%" }}
            title={"Add an exercise"}
            titleStyle={{height: 45, fontSize: 20}}
            rows={addExerciseRows}
            closeButton
            closeButtonOnPress={() => {
              setAddingExercise(false);
            }}
            noBodyLines
          />
        )}
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
