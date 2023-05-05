import React, { useEffect } from "react";
import { View, Pressable, StyleSheet, ScrollView } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomIcon from "../components/CustomIcon";
import CustomInput from "../components/CustomInput";
import CustomText from "../components/CustomText";
import Gap from "../components/Gap";
import IndexCard from "../components/IndexCard";
import { AppStore } from "../stores/appStore";
import { EquipmentType, Exercise, ExerciseType } from "../stores/types";
import { colors, universalStyles } from "../utilities/stylevars";

const Exercises = () => {
  const { state, dispatch } = React.useContext(AppStore);

  const [selectedExercise, setSelectedExercise] = React.useState<Exercise>();
  const [isEditingExercise, setIsEditingExercise] = React.useState(false);

  // sets initial value to detailed exercise view
  useEffect(() => {
    if (state.exerciseLookup.list !== undefined) {
      setSelectedExercise(state.exerciseLookup.list[0]);
    }
  }, [state.exerciseLookup.list]);

  const handleDelete = () => {
    if (selectedExercise) {
      dispatch({
        name: "deleteExercise",
        payload: { itemId: selectedExercise.id, user_token: state.userToken },
        user: state.userId,
      });
    }
  };

  const selectedExerciseTitle = (
    <View
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: 5,
      }}
    >
      <CustomText bold style={{ textTransform: "uppercase", padding: 5 }}>
        {selectedExercise?.name || "TITLE"}
      </CustomText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <View
          style={{
            height: 21,
            minWidth: 50,
            borderRadius: 5,
            paddingHorizontal: 5,
            backgroundColor: colors.moreTransparentGreenTheme,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <CustomText fontSize={12}>
            {selectedExercise?.equipment_type?.name}
          </CustomText>
        </View>
        <View
          style={{
            height: 21,
            minWidth: 50,
            borderRadius: 5,
            paddingHorizontal: 5,
            backgroundColor: colors.moreTransparentGreenTheme,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <CustomText fontSize={12}>
            {selectedExercise?.exercise_type?.name}
          </CustomText>
        </View>
      </View>
    </View>
  );

  const selectedExerciseDetails = [
    <View style={{ minHeight: 30, padding: 5 }}>
      <CustomText italic>
        {selectedExercise?.description || "No description yet..."}
      </CustomText>
    </View>,
    <View style={{ height: 30, padding: 5 }}>
      <CustomText>Used in 5 workouts and 25 sessions</CustomText>
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
        color={colors.transparentGreenTheme}
        iconSize={34}
        style={{ padding: 5, marginHorizontal: 5 }}
      />
      <Pressable
        onPress={() => {
          setIsEditingExercise(true);
        }}
      >
        <CustomIcon
          name="edit"
          iconProvider="MaterialIcons"
          color={colors.transparentGreenTheme}
          iconSize={30}
          style={{ padding: 5, marginHorizontal: 5 }}
        />
      </Pressable>
      <Pressable onPress={handleDelete}>
        <CustomIcon
          name="trash-can"
          iconProvider="MaterialCommunityIcons"
          color={colors.transparentGreenTheme}
          iconSize={30}
          style={{ padding: 5, marginLeft: 5 }}
        />
      </Pressable>
    </View>,
  ];

  type CreateExercisePayload = {
    name: string;
    user_token: string | null;
    description?: string;
    exercise_type_id?: number;
    equipment_type_id?: number;
  }
  
  type EditExercisePayload = {
    name?: string,
    itemId: number | undefined,
    user_token: string | null;
    description?: string;
    exercise_type_id?: number;
    equipment_type_id?: number;
  }

  const [isAddingExercise, setIsAddingExercise] = React.useState(false);

  const [name, setName] = React.useState(
    isAddingExercise ? "" : selectedExercise?.name
  );
  const [description, setDescription] = React.useState(
    isAddingExercise ? "" : selectedExercise?.description
  );
  const [selectedExerciseType, setSelectedExerciseType] =
    React.useState<ExerciseType>();
  const [selectedEquipmentType, setSelectedEquipmentType] =
    React.useState<EquipmentType>();
  const [isExerciseTypeDropdownOpen, setIsExerciseTypeDropdownOpen] =
    React.useState(false);
  const [isEquipmentTypeDropdownOpen, setIsEquipmentTypeDropdownOpen] =
    React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  useEffect(() => {
    if (isEditingExercise) {
      setSelectedExerciseType(selectedExercise?.exercise_type);
      setSelectedEquipmentType(selectedExercise?.equipment_type);
    }
    if (isAddingExercise) {
      setSelectedExerciseType(undefined);
      setSelectedEquipmentType(undefined);
    }
  }, [
    isEditingExercise,
    isAddingExercise,
    selectedExercise,
    setSelectedEquipmentType,
    setSelectedExerciseType,
  ]);

  const submitCreateExercise = () => {
    if (!name) {
      setErrorMessage("name is required");
      return;
    }
    let payload: CreateExercisePayload = { name: name, user_token: state.userToken };
    if (description !== undefined) {
      payload.description = description;
    }
    if (selectedExerciseType !== undefined) {
      payload.exercise_type_id = selectedExerciseType.id;
    }
    if (selectedEquipmentType !== undefined) {
      payload.equipment_type_id = selectedEquipmentType.id;
    }
    dispatch({ name: "createExercise", payload: payload, user: state.userId });
    setIsAddingExercise(false);
  };

  const submitEditExercise = () => {
    let payload: EditExercisePayload = { user_token: state.userToken, itemId: selectedExercise?.id };
    if (name !== selectedExercise?.name) {
      payload.name = name;
    }
    if (description !== selectedExercise?.description) {
      payload.description = description;
    }
    // always send exercise_type_id and equipment_type_id = if none, then will not attach
    payload.exercise_type_id = selectedExerciseType?.id;
    payload.equipment_type_id = selectedEquipmentType?.id;
    dispatch({ name: "editExercise", payload: payload, user: state.userId });
    setIsEditingExercise(false);
  };

  const addEditExerciseBody = (
    <>
      <View
        style={{
          height: 45,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: 10,
        }}
      >
        <CustomInput
          onChangeText={setName}
          defaultValue={isAddingExercise ? "" : selectedExercise?.name}
          placeholder={isAddingExercise ? "name" : selectedExercise?.name}
          style={{ marginTop: 5, width: "90%", maxWidth: 500 }}
        />
      </View>
      ,
      <View
        style={{
          height: 45,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: 10,
        }}
      >
        <CustomInput
          onChangeText={setDescription}
          defaultValue={isAddingExercise ? "" : selectedExercise?.description}
          // value={description}
          placeholder={
            isAddingExercise || !selectedExercise?.description
              ? "description"
              : selectedExercise?.description
          }
          style={{ marginTop: 5, width: "90%", maxWidth: 500 }}
        />
      </View>
      <View
        style={{
          height: 45,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: 10,
        }}
      >
        <CustomButton
          buttonColor={colors.lightGrayTheme}
          style={{ width: 200, justifyContent: "space-between", padding: 5 }}
          onPress={() => {
            setIsExerciseTypeDropdownOpen(!isExerciseTypeDropdownOpen);
            isEquipmentTypeDropdownOpen
              ? setIsEquipmentTypeDropdownOpen(false)
              : null;
          }}
        >
          <CustomText>
            {!selectedExerciseType
              ? "Select Exercise Type"
              : selectedExerciseType.name}
          </CustomText>
          <CustomIcon
            iconProvider="Feather"
            name={isExerciseTypeDropdownOpen ? "chevrons-up" : "chevrons-down"}
            color="black"
            iconSize={20}
          />
        </CustomButton>
        {isExerciseTypeDropdownOpen && (
          <View style={{ backgroundColor: "red" }}>
            {state.exerciseTypeLookup.list?.length > 0 && (
              <>
                <Pressable
                  onPress={() => {
                    setSelectedExerciseType(undefined);
                    setIsExerciseTypeDropdownOpen(false);
                  }}
                  style={{ height: 25 }}
                >
                  <CustomText>None</CustomText>
                </Pressable>
                {state.exerciseTypeLookup.list.map((et: ExerciseType) => (
                  <Pressable
                    onPress={() => {
                      setSelectedExerciseType(et);
                      setIsExerciseTypeDropdownOpen(false);
                    }}
                    key={et.name}
                    style={{ height: 25 }}
                  >
                    <CustomText>{et.name}</CustomText>
                  </Pressable>
                ))}
              </>
            )}
          </View>
        )}
      </View>
      <View
        style={{
          height: 45,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: 10,
        }}
      >
        <CustomButton
          buttonColor={colors.lightGrayTheme}
          style={{ width: 200, justifyContent: "space-between", padding: 5 }}
          onPress={() => {
            setIsEquipmentTypeDropdownOpen(!isEquipmentTypeDropdownOpen);
            isExerciseTypeDropdownOpen
              ? setIsExerciseTypeDropdownOpen(false)
              : null;
          }}
        >
          <CustomText>
            {!selectedEquipmentType
              ? "Select Equipment Type"
              : selectedEquipmentType.name}
          </CustomText>
          <CustomIcon
            iconProvider="Feather"
            name={isEquipmentTypeDropdownOpen ? "chevrons-up" : "chevrons-down"}
            color="black"
            iconSize={20}
          />
        </CustomButton>
        {isEquipmentTypeDropdownOpen && (
          <View style={{ backgroundColor: "red" }}>
            {state.equipmentTypeLookup.list?.length > 0 && (
              <>
                <Pressable
                  onPress={() => {
                    setSelectedEquipmentType(undefined);
                    setIsEquipmentTypeDropdownOpen(false);
                  }}
                  style={{ height: 25 }}
                >
                  <CustomText>None</CustomText>
                </Pressable>

                {state.equipmentTypeLookup.list.map((et: EquipmentType) => (
                  <Pressable
                    onPress={() => {
                      setSelectedEquipmentType(et);
                      setIsEquipmentTypeDropdownOpen(false);
                    }}
                    key={et.name}
                  >
                    <CustomText>{et.name}</CustomText>
                  </Pressable>
                ))}
              </>
            )}
          </View>
        )}
      </View>
      <View
        style={{
          height: 45,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: 10,
        }}
      >
        <CustomButton
          onPress={isAddingExercise ? submitCreateExercise : submitEditExercise}
          style={{ width: 200 }}
        >
          <CustomText bold color="white">
            {isAddingExercise ? "Create exercise" : "Save changes"}
          </CustomText>
        </CustomButton>
      </View>
    </>
  );

  if (!state.exerciseLoaded) {
    return null;
  } else {
    return (
      <View style={universalStyles.page}>
        <Gap height={20} />
        <CustomButton
          onPress={() => {
            setIsAddingExercise(true);
          }}
          style={{ width: 120 }}
        >
          <CustomText bold color="white">
            Add Exercise
          </CustomText>
        </CustomButton>
        <Gap height={20} />
        <View style={styles.exerciseList}>
          <ScrollView style={{ width: "100%", paddingBottom: 20 }}>
            {state.exerciseLookup.list.map((exercise: Exercise) => (
              <View key={exercise.name} style={styles.exerciseItem}>
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
                    color={colors.darkGreenTheme}
                    bold={exercise == selectedExercise ? true : false}
                    fontSize={exercise == selectedExercise ? 18 : 16}
                  >
                    {exercise.name}
                  </CustomText>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
        <IndexCard
          cardStyle={{ position: "absolute", bottom: 10 }}
          title={selectedExerciseTitle}
          rows={selectedExerciseDetails}
        />
        {(isAddingExercise || isEditingExercise) && (
          <IndexCard
            cardStyle={{ position: "absolute", height: "100%", width: "100%" }}
            title={
              isAddingExercise
                ? "Add an exercise"
                : "Edit " + selectedExercise?.name
            }
            titleStyle={{ height: 45, fontSize: 20 }}
            body={addEditExerciseBody}
            closeButton
            closeButtonOnPress={() => {
              isAddingExercise
                ? setIsAddingExercise(false)
                : setIsEditingExercise(false);
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
  exerciseItem: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    margin: 10,
  },
  dividingLine: { width: "100%", height: 1, backgroundColor: "gray" },
});

export default Exercises;
