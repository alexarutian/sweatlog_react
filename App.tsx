import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Home from "./pages/Home";
import Agenda from "./pages/Agenda";
import Exercises from "./pages/Exercises";
import Workouts from "./pages/Workouts";
import Footer, { NavOption } from "./components/Footer";
import Settings from "./pages/Settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContextProvider, AppStore } from "./stores/appStore";
import {
  Block,
  Exercise,
  ExerciseType,
  IncomingBlock,
  IncomingExercise,
  IncomingWorkout,
  Lookup,
  Workout,
} from "./stores/types";

const AppInner = () => {
  const { state, dispatch } = React.useContext(AppStore);

  const getSecureStoreInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("user_token");
      const email = await AsyncStorage.getItem("user_email");
      const id = await AsyncStorage.getItem("user_id");

      if (token && email && id) {
        dispatch({ name: "setUserInfo", payload: { token, email, id } });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getLastPage = async () => {
    try {
      const lastPage = await AsyncStorage.getItem("last_page");
      if (lastPage) {
        dispatch({ name: "setCurrentPage", payload: lastPage });
        setPage(lastPage);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [userDataLoaded, setUserDataLoaded] = useState(false);

  const [page, setPage] = useState("home");

  const navigateToPage = async (page: string) => {
    setPage(page);
    dispatch({ name: "asyncSetPage", payload: page });
  };

  const getAllBackendData = () => {
    dispatch({ name: "getAllExerciseTypes", payload: { user_token: state.userToken } });
    dispatch({ name: "getAllEquipmentTypes", payload: { user_token: state.userToken } });
    // dispatch({ name: "getAllSessions", payload: { user_token: state.userToken }, user: state.userId });
  };

  // const assembleExercises = (incomingExerciseList: IncomingExercise[]) => {
  //   let exerciseMap: { [key: number]: Exercise } = {};

  //   let exerciseList = incomingExerciseList.map((exercise: IncomingExercise) => {
  //     let exerciseType =
  //       exercise.exercise_type_id == undefined ? undefined : state.exerciseTypeLookup.byId[exercise.exercise_type_id];
  //     let equipmentType =
  //       exercise.equipment_type_id == undefined
  //         ? undefined
  //         : state.equipmentTypeLookup.byId[exercise.equipment_type_id];
  //     const exerciseObject = {
  //       name: exercise.name,
  //       id: exercise.id,
  //       description: exercise.description,
  //       exercise_type: exerciseType,
  //       equipment_type: equipmentType,
  //     };
  //     exerciseMap[exercise.id] = exerciseObject;
  //     return exerciseObject;
  //   });
  //   const lookup: Lookup<Exercise> = { list: exerciseList as unknown as Exercise[], byId: exerciseMap };
  //   dispatch({ name: "setExerciseLookup", payload: lookup });
  // };

  // const assembleBlocks = () => {
  //   let blockMap: { [key: number]: Block } = {};

  //   let blockList: Block[] = state.blockList.map((block: IncomingBlock) => {
  //     let exercises = block.exercises.map((ex) => {
  //       console.log(state.exerciseLookup.byId);
  //       let exercise = state.exerciseLookup.byId[ex.exercise_id];
  //       const exerciseObject = {
  //         exercise_order: ex.exercise_order,
  //         stats: ex.stats,
  //         exercise: exercise,
  //       };
  //       return exerciseObject;
  //     });

  //     const blockObject: Block = {
  //       name: block.name,
  //       id: block.id,
  //       exercises: exercises,
  //     };
  //     blockMap[block.id] = blockObject;
  //     return blockObject;
  //   });
  //   const lookup: Lookup<Block> = { list: blockList as unknown as Block[], byId: blockMap };
  //   dispatch({ name: "setBlockLookup", payload: lookup });
  // };

  // const assembleWorkouts = () => {
  //   let workoutMap: { [key: number]: Workout } = {};
  //   let workoutList: Workout[] = state.workoutList.map((workout: IncomingWorkout) => {
  //     let blocks = workout.blocks.map((bl) => {
  //       let block = state.blockLookup.byId[bl.block_id];
  //       const blockObj = {
  //         block_order: bl.block_order,
  //         block_quantity: bl.block_quantity,
  //         block: block,
  //       };
  //       return blockObj;
  //     });
  //     const workoutObject: Workout = {
  //       name: workout.name,
  //       id: workout.id,
  //       blocks: blocks,
  //     };
  //     workoutMap[workout.id] = workoutObject;
  //     return workoutObject;
  //   });
  //   const lookup: Lookup<Workout> = { list: workoutList as unknown as Workout[], byId: workoutMap };
  //   dispatch({ name: "setWorkoutLookup", payload: lookup });
  // };

  useEffect(() => {

    if (state.exerciseTypeLoaded && state.equipmentTypeLoaded && !state.exerciseLoaded) {
      dispatch({ name: "getAllExercises", payload: { user_token: state.userToken }, user: state.userId });
    }
    if (state.exerciseLoaded && !state.blockLoaded) {
      dispatch({ name: "getAllBlocks", payload: { user_token: state.userToken }, user: state.userId });
    }
    if (state.blockLoaded && !state.workoutLoaded) {
      dispatch({ name: "getAllWorkouts", payload: { user_token: state.userToken }, user: state.userId });
    }
  }, [state.exerciseTypeLoaded, state.equipmentTypeLoaded, state.exerciseLoaded, state.blockLoaded, state.workoutLoaded]);

  const navOptions: NavOption[] = [
    { name: "agenda", iconName: "calendar-today", iconProvider: "MaterialCommunityIcons" },
    { name: "exercises", iconName: "arm-flex", iconProvider: "MaterialCommunityIcons" },
    { name: "home", iconName: "star", iconProvider: "Ionicons" },
    { name: "workouts", iconName: "barbell", iconProvider: "Ionicons" },
    { name: "settings", iconName: "settings-sharp", iconProvider: "Ionicons" },
  ];

  React.useEffect(() => {
    getLastPage();
    if (state.userToken == null || !state.userId) {
      getSecureStoreInfo();
    } else {
      if (!userDataLoaded) {
        getAllBackendData();
        if (state.exerciseList.length > 0) {
          setUserDataLoaded(true);
        }
      }
    }
  }, [userDataLoaded, state.userToken, state.userId]);

  // React.useEffect(() => {
  //   console.log(state.exerciseList);
  //   console.log(state.sessionList);
  //   console.log(state.workoutList);
  // }, [state.exerciseList, state.sessionList, state.workoutList]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            setPage("home");
          }}
        >
          <Text style={styles.title}>SWEATLOG</Text>
        </Pressable>
      </View>
      <View style={styles.body}>
        {page === "home" && <Home />}
        {page === "agenda" && <Agenda />}
        {page === "exercises" && <Exercises />}
        {page === "workouts" && <Workouts />}
        {page === "settings" && <Settings />}
      </View>
      <View style={styles.footer}>
        <Footer navOptions={navOptions} buttonOnClick={navigateToPage} activePage={page} />
      </View>
    </View>
  );
};

export default function App() {
  return (
    <AppContextProvider>
      <AppInner></AppInner>
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  header: {
    height: 85,
    width: "100%",
    backgroundColor: "green",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "white",
  },
  body: {
    flexGrow: 1,
    flexShrink: 1,
    width: "100%",
  },
  footer: {
    flexGrow: 0,
    height: 60,
    width: "100%",
    backgroundColor: "green",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
