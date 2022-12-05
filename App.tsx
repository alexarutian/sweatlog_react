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
import * as Font from "expo-font";
import { colors } from "./utilities/stylevars";

const AppInner = () => {
  const { state, dispatch } = React.useContext(AppStore);

  const getSecureStoreInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("user_token");
      const email = await AsyncStorage.getItem("user_email");
      const id_string = await AsyncStorage.getItem("user_id");
      const id = Number(id_string);

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
    }
    if (!state.equipmentTypeLoaded) {
      dispatch({ name: "getAllEquipmentTypes", payload: { user_token: state.userToken } });
    }
    // dispatch({ name: "getAllSessions", payload: { user_token: state.userToken }, user: state.userId });
  };

  const [fontsLoaded, setFontsLoaded] = useState(false);
  async function loadFonts() {
    await Font.loadAsync({
      // Loading fonts directly from static resource (assets folder)
      Graduate: require("./assets/fonts/Graduate-Regular.ttf"),
      Inter: require("./assets/fonts/Inter-Regular.ttf"),
      InterBold: require("./assets/fonts/Inter-Bold.ttf"),

    });
    setFontsLoaded(true);
  }

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
    if (state.workoutLoaded && !state.sessionLoaded ) {
      dispatch({name: "getAllSessions", payload: { user_token: state.userToken }, user: state.userId })
    }
  }, [
    state.exerciseTypeLoaded,
    state.equipmentTypeLoaded,
    state.exerciseLoaded,
    state.blockLoaded,
    state.workoutLoaded,
    state.sessionLoaded
  ]);

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
    loadFonts();
  }, [userDataLoaded, state.userToken, state.userId, state.exerciseTypeLoaded, state.equipmentTypeLoaded]);

  if (fontsLoaded) {
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
  } else {
    return null;
  }
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
    overflow: "hidden"
  },
  header: {
    height: 100,
    width: "100%",
    backgroundColor: colors.greenTheme,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 5,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Graduate",
    letterSpacing: 6
  },
  body: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 500,
    width: "100%",
  },
  footer: {

    height: 80,
    paddingBottom: 15,
    width: "100%",
    backgroundColor: colors.greenTheme,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
