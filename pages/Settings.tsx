import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useState, useContext} from "react";
import { View, TextInput, Pressable } from "react-native";
import CustomText from "../components/CustomText";
import { AppStore } from "../stores/appStore";

const Settings = () => {
  const {state, dispatch} = useContext(AppStore);

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")


  const login = async () => {
    dispatch({name: "asyncLoginUser", payload: { email, password }})
    setEmail("");
    setPassword("");
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user_token");
      await AsyncStorage.removeItem("user_email");
    } catch (e) {
      console.log(e)
    }

  }

  return (
    <View>
      <CustomText bold>Settings</CustomText>
      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder="email"
        selectTextOnFocus={true}
        clearButtonMode="always"
        style={{ borderWidth: 1, borderColor: "black" }}
      />
      <TextInput
        onChangeText={setPassword}
        value={password}
        placeholder="password"
        selectTextOnFocus={true}
        clearButtonMode="always"
        style={{ borderWidth: 1, borderColor: "black" }}
      />
      <Pressable onPress={login}>
        <CustomText>Login</CustomText>
      </Pressable>
      <CustomText>{state.userToken}</CustomText>
      <Pressable onPress={logout}>Logout</Pressable>
    </View>
  );
};

export default Settings;
