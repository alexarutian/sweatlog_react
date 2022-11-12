import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomIcon from "../components/CustomIcon";
import CustomInput from "../components/CustomInput";
import CustomText from "../components/CustomText";
import Gap from "../components/Gap";
import { AppStore } from "../stores/appStore";
import { EquipmentType, ExerciseType } from "../stores/types";
import { universalStyles } from "../utilities/stylevars";

const Settings = () => {
  const { state, dispatch } = useContext(AppStore);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [createNewUser, setCreateNewUser] = useState(false)

  const loginCreateTextPrompt = createNewUser ? "Login with preexisting account instead?" : "Create new user instead?"

  const handleLoginCreatePrompt = () => {
    setCreateNewUser(!createNewUser)
  }

  const [settingsPage, setSettingsPage] = useState("main");

  const isMatchingPassword =  createNewUser && (password === passwordConfirm)

  const handleLoginOrCreate = async () => {
    if (createNewUser && isMatchingPassword) {
      dispatch({name: "asyncCreateUser", payload: {email, password}})
    } else {
      dispatch({ name: "asyncLoginUser", payload: { email, password } });
    }
    setEmail("");
    setPassword("");
    setPasswordConfirm("")
  };

  const logout = async () => {
    dispatch({ name: "asyncLogoutUser" });
  };

  const goToMainSettings = () => {
    setSettingsPage("main");
  };

  // TEMPORARY FIX - add this to the appStore or another store
  // const refreshAllData = () => {
  //   dispatch({ name: "getAllExerciseTypes", payload: { user_token: state.userToken } });
  //   dispatch({ name: "getAllEquipmentTypes", payload: { user_token: state.userToken } });

  //   dispatch({ name: "getAllExercises", payload: { user_token: state.userToken }, user: state.userId });
  //   dispatch({ name: "getAllWorkouts", payload: { user_token: state.userToken }, user: state.userId });
  //   dispatch({ name: "getAllSessions", payload: { user_token: state.userToken }, user: state.userId });
  //   dispatch({ name: "getAllBlocks", payload: { user_token: state.userToken }, user: state.userId });
  // };

  const ExerciseTypesPage = () => {

    return (
      <View style={universalStyles.page}>
        <Gap height={10} />
        <Pressable style={styles.backButton} onPress={goToMainSettings}>
          <CustomIcon name="chevron-back" iconProvider="Ionicons" color="blue" iconSize={18} />
          <CustomText color="blue" fontSize={16}>
            Settings
          </CustomText>
        </Pressable>
        {state.exerciseTypeLookup.list.map((exerciseType: ExerciseType, idx: number) => (
          <CustomText key={idx}>{exerciseType.name}</CustomText>
        ))}
      </View>
    );
  };

  const EquipmentTypesPage = () => {
    return (
      <View style={universalStyles.page}>
        <Gap height={10} />
        <Pressable style={styles.backButton} onPress={goToMainSettings}>
          <CustomIcon name="chevron-back" iconProvider="Ionicons" color="blue" iconSize={18} />
          <CustomText color="blue" fontSize={16}>
            Settings
          </CustomText>
        </Pressable>
        {state.equipmentTypeLookup.list.map((equipmentType: EquipmentType, idx: number) => (
          <CustomText key={idx}>{equipmentType.name}</CustomText>
        ))}

      </View>
    );
  };

  if (settingsPage == "exerciseTypes") return <ExerciseTypesPage />;
  if (settingsPage == "equipmentTypes") return <EquipmentTypesPage />;
  // if (settingsPage == "main")
  else {
    return (
      <View style={universalStyles.page}>
        <Gap height={10} />
        <View style={styles.section}>
          <CustomText bold fontSize={20} style={{ padding: 10 }}>
            Settings
          </CustomText>
          <View style={styles.dividingLine} />
          <Pressable
            style={styles.settingsButton}
            onPress={() => {
              setSettingsPage("exerciseTypes");
            }}
          >
            <CustomText>Exercise Types</CustomText>
            <CustomIcon name="chevron-forward" iconProvider="Ionicons" color="lightgray" iconSize={14} />
          </Pressable>
          <View style={styles.dividingLine} />
          <Pressable
            style={styles.settingsButton}
            onPress={() => {
              setSettingsPage("equipmentTypes");
            }}
          >
            <CustomText>EquipmentTypes</CustomText>
            <CustomIcon name="chevron-forward" iconProvider="Ionicons" color="lightgray" iconSize={14} />
          </Pressable>
        </View>
        <View style={styles.section}>
          <CustomText bold fontSize={20} style={{ padding: 10 }}>
            {createNewUser ? "Create New User" : "User Login"}
          </CustomText>
          <View style={{ padding: 10 }}>
            {!state.userToken && (
              <>
                <Pressable onPress={handleLoginCreatePrompt}><CustomText bold color={"green"}>{loginCreateTextPrompt}</CustomText></Pressable>
                <Gap height={10}/>
                <CustomInput onChangeText={setEmail} value={email} placeholder="email" style={{ marginTop: 5 }} />
                <CustomInput
                  onChangeText={setPassword}
                  value={password}
                  placeholder="password"
                  isPassword
                  style={{ marginTop: 5 }}
                />
                {createNewUser &&                 <CustomInput
                  onChangeText={setPasswordConfirm}
                  value={passwordConfirm}
                  placeholder="confirm password"
                  isPassword
                  style={{ marginTop: 5 }}
                />}
                <CustomButton onPress={handleLoginOrCreate} style={{ width: 100 }}>
                  <CustomText bold color="white">
                    {createNewUser ? "Create user" : "Login"}
                  </CustomText>
                </CustomButton>
              </>
            )}
            {state.userToken && (
              <>
                <CustomText>
                  You are currently logged in as <CustomText bold>{state.email}</CustomText>
                </CustomText>
                <Gap height={10} />
                <CustomButton onPress={logout} style={{ width: 100 }}>
                  <CustomText bold color="white">
                    Logout
                  </CustomText>
                </CustomButton>
              </>
            )}
          </View>
        </View>
        <View style={[styles.section, { padding: 10 }]}>
          <CustomText bold>Re-pull data</CustomText>
          <Pressable onPress={() => {}}>
            <CustomIcon name="refresh-outline" iconProvider="Ionicons" color="black" />
          </Pressable>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  section: { width: "95%", borderRadius: 6, backgroundColor: "white", marginBottom: 10 },
  settingsButton: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 },
  backButton: { width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" },
  dividingLine: { height: 0.5, width: "100%", backgroundColor: "lightgray" },
});

export default Settings;
