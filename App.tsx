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
    if (!state.exerciseTypeLoaded) {
      dispatch({ name: "getAllExerciseTypes", payload: { user_token: state.userToken } });
    } if (!state.equipmentTypeLoaded) {
      dispatch({ name: "getAllEquipmentTypes", payload: { user_token: state.userToken } });
    }
    // dispatch({ name: "getAllSessions", payload: { user_token: state.userToken }, user: state.userId });
  };


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

  useEffect(() => {
    getLastPage();
    if (state.userToken == null || !state.userId) {
      getSecureStoreInfo();
    } 
      if ((!state.exerciseTypeLoaded || !state.equipmentTypeLoaded) && state.userToken && state.userId) {
        getAllBackendData();
      }
  }, [userDataLoaded, state.userToken, state.userId, state.exerciseTypeLoaded, state.equipmentTypeLoaded]);

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
