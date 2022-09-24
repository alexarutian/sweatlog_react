import React, { useState } from "react";
import { ListViewBase, Pressable, StyleSheet, Text, View } from "react-native";
import Home from "./pages/Home";
import Agenda from "./pages/Agenda";
import Exercises from "./pages/Exercises";
import Workouts from "./pages/Workouts";
import Footer, { NavOption } from "./components/Footer";
import Settings from "./pages/Settings";
import { getStateValue, getStateValueCollection } from "./utilities/contexthelper";
// import { AppContext } from "./contexts/appcontext";
import { backendButler } from "./utilities/ajax";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContextProvider, AppStore } from "./stores/appStore";

// type InitialContext = {
//   userToken: string | null,
//   email: string | null,
//   exerciseList: [],
//   equipmentList: [],
//   workoutList: [],
//   currentPage: string,
//   statusCode: number | null,
//   error: string | null,
//   userError: any,
// }

// StateVar is a class
// one if its fields can be one of many different types
// this is a template of sorts
// class StateVar<varType> {
//   public value : varType;
//   public set: React.Dispatch<React.SetStateAction<varType>>;

//   constructor(dflt: varType){
//     [this.value, this.set] = React.useState<varType>(dflt);
//   }

//   public get() {
//     return this.value
//   }
// }

// class StateVar2<varType> {
//   public value : varType;
//   public set: React.Dispatch<React.SetStateAction<varType>>;

//   constructor(useStateResult: [varType, React.Dispatch<React.SetStateAction<varType>>]){
//     this.value = useStateResult[0];
//     this.set = useStateResult[1];
//   }

//   public get() {
//     return this.value
//   }
// }

const AppInner = () => {
  const { state, dispatch } = React.useContext(AppStore);

  // set up initial state of app
  // const context: InitialContext = getStateValueCollection({
  //   // fetch request dumps
  //   exerciseList: [],
  //   exerciseTypeList: [],
  //   equipmentTypeList: [],
  //   workoutList: [],
  //   // internal state situations
  //   email: "not logged in yet!",
  //   userToken: null,
  //   currentPage: "home",
  //   // error messages
  //   statusCode: null,
  //   error: null,
  //   userError: null,
  //   ajax: {}
  // }) as InitialContext;

  // let userToken = new StateVar("")
  // let exerciseList = new StateVar([])

  // let AppContext = React.createContext({})

  // let initialValue = {
  //   userToken: new StateVar(""),
  //   exerciseList: new StateVar([]),
  // }

  const getSecureStoreInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("user_token");
      const email = await AsyncStorage.getItem("user_email");
      const lastPage = await AsyncStorage.getItem("last_page");

      if (token) {
        dispatch({ name: "setUserToken", payload: token });
      }
      if (email) {
        dispatch({ name: "setEmail", payload: email });
      }

      // if (lastPage) {
      //   context.currentPage.set(lastPage);
      // }
    } catch (e) {
      console.log(e);
    }
  };

  const [userDataLoaded, setUserDataLoaded] = useState(false);

  const [page, setPage] = useState("home");

  const navOptions: NavOption[] = [
    { name: "agenda", iconName: "calendar-today", iconProvider: "MaterialCommunityIcons" },
    { name: "exercises", iconName: "arm-flex", iconProvider: "MaterialCommunityIcons" },
    { name: "home", iconName: "star", iconProvider: "Ionicons" },
    { name: "workouts", iconName: "barbell", iconProvider: "Ionicons" },
    { name: "settings", iconName: "settings-sharp", iconProvider: "Ionicons" },
  ];

  // React.useEffect(() => {
  // }, [context.exerciseList])

  React.useEffect(() => {
    if (state.userToken == null) {
      getSecureStoreInfo();
    } else {
      if (!userDataLoaded) {
        setUserDataLoaded(true);
        dispatch({ name: "getAllExercises", payload: { user_token: state.userToken } });
        dispatch({ name: "getAllWorkouts", payload: { user_token: state.userToken } });
      }
    }
  }, [userDataLoaded, state.userToken]);

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
        <Footer navOptions={navOptions} buttonOnClick={setPage} activePage={page} />
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
