import React, { useState, useContext } from "react";
import { View, Pressable, StyleSheet } from "react-native";
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

  const [settingsPage, setSettingsPage] = useState("main");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [createNewUser, setCreateNewUser] = useState(false);

  const isMatchingPassword = createNewUser && password === passwordConfirm;
  const loginCreateTextPrompt = createNewUser ? "Login with preexisting account instead?" : "Create new user instead?";

  const handleLoginOrCreate = async () => {
    if (createNewUser && isMatchingPassword) {
      dispatch({ name: "asyncCreateUser", payload: { email, password } });
    } else {
      dispatch({ name: "asyncLoginUser", payload: { email, password } });
    }
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
  };

  const settingsBackButton = (
    <Pressable
      style={styles.backButton}
      onPress={() => {
        setSettingsPage("main");
      }}
    >
      <CustomIcon name="chevron-back" iconProvider="Ionicons" color="blue" iconSize={18} />
      <CustomText color="blue" fontSize={16}>
        Settings
      </CustomText>
    </Pressable>
  );

  type ETPageProps = {
    dataType: "exerciseType" | "equipmentType";
    list: ExerciseType[] | EquipmentType[];
  };

  const ETPage = ({ dataType, list }: ETPageProps) => {
    // when I move this outside of this functional component, input doesn't work properly - WHY
    const [name, setName] = useState("");

    const [selected, setSelected] = useState<ExerciseType | EquipmentType>();

    const submitEdit = () => {
      if (selected) {
        dispatch({
          name: dataType === "exerciseType" ? "editExerciseType" : "editEquipmentType",
          payload: { itemId: selected.id, user_token: state.userToken, name: name },
          user: state.userId,
        });
      }
      setSelected(undefined);
    };

    const submitDelete = (et: ExerciseType | EquipmentType) => {
      if (et) {
        dispatch({
          name: dataType === "exerciseType" ? "deleteExerciseType" : "deleteEquipmentType",
          payload: { itemId: et.id, user_token: state.userToken },
          user: state.userId,
        });
      }
    };

    const [isAdding, setIsAdding] = useState(false);

    const submitCreate = () => {
      if (name) {
        dispatch({
          name: dataType === "exerciseType" ? "createExerciseType" : "createEquipmentType",
          payload: { user_token: state.userToken, name: name },
          user: state.userId,
        });
      }
    };
    const hideCreateGUI = () => {
      setIsAdding(false);
      setName("");
    };

    return (
      <View style={universalStyles.page}>
        <Gap height={10} />
        {settingsBackButton}
        {list.map((item: ExerciseType | EquipmentType) => {
          let isSelected = item === selected;
          return (
            <View key={item.name} style={styles.etListItem}>
              {!isSelected ? (
                <Pressable
                  onPress={() => {
                    setSelected(item);
                    setIsAdding(false);
                  }}
                  style={{ width: 200 }}
                >
                  <CustomText fontSize={16}>
                    {item.name}
                  </CustomText>
                </Pressable>
              ) : (
                <CustomInput
                  defaultValue={item.name}
                  // value={etName}
                  placeholder={item.name}
                  onChangeText={setName}
                />
              )}
              <View style={styles.etListItemButtons}>
                {isSelected ? (
                  <Pressable onPress={submitEdit} style={{ width: 50, alignItems: "center", justifyContent: "center" }}>
                    <CustomIcon iconProvider="Feather" name="check" iconSize={25} color="green" />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      setSelected(item);
                      setIsAdding(false);
                    }}
                    style={{ width: 50, alignItems: "center", justifyContent: "center" }}
                  >
                    <CustomIcon name="edit" iconProvider="MaterialIcons" color="rgba(60, 73, 63, 0.3)" iconSize={30} />
                  </Pressable>
                )}
                <Pressable
                  onPress={() => {
                    submitDelete(item);
                  }}
                  style={{ width: 50, alignItems: "center", justifyContent: "center" }}
                >
                  <CustomIcon
                    iconProvider="MaterialCommunityIcons"
                    name="trash-can"
                    iconSize={34}
                    color="rgba(60, 73, 63, 0.3)"
                  />
                </Pressable>
              </View>
            </View>
          );
        })}
        {isAdding && (
          <View style={styles.etListItem}>
            <CustomInput value={name} placeholder={"enter name here"} onChangeText={setName} />
            <View style={styles.etListItemButtons}>
              <Pressable onPress={submitCreate} style={{ width: 50, alignItems: "center", justifyContent: "center" }}>
                <CustomIcon iconProvider="Feather" name="check" iconSize={25} color="green" />
              </Pressable>
              <Pressable onPress={hideCreateGUI} style={{ width: 50, alignItems: "center", justifyContent: "center" }}>
                <CustomIcon
                  iconProvider="MaterialCommunityIcons"
                  name="trash-can"
                  iconSize={34}
                  color="rgba(60, 73, 63, 0.3)"
                />
              </Pressable>
            </View>
          </View>
        )}
        <Gap height={40} />
        <CustomButton
          onPress={() => {
            setIsAdding(true);
            setSelected(undefined);
          }}
          style={{ width: 200 }}
        >
          <CustomText color="white" bold>
            {dataType == "exerciseType" ? "Add Exercise Type" : "Add Equipment Type"}
          </CustomText>
        </CustomButton>
      </View>
    );
  };

  if (settingsPage == "exerciseTypes") return <ETPage dataType="exerciseType" list={state.exerciseTypeLookup.list} />;
  if (settingsPage == "equipmentTypes")
    return <ETPage dataType="equipmentType" list={state.equipmentTypeLookup.list} />;
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
            <CustomText fontSize={16}>Exercise Types</CustomText>
            <CustomIcon name="chevron-forward" iconProvider="Ionicons" color="lightgray" iconSize={14} />
          </Pressable>
          <View style={styles.dividingLine} />
          <Pressable
            style={styles.settingsButton}
            onPress={() => {
              setSettingsPage("equipmentTypes");
            }}
          >
            <CustomText fontSize={16}>Equipment Types</CustomText>
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
                <Pressable
                  onPress={() => {
                    setCreateNewUser(!createNewUser);
                  }}
                >
                  <CustomText bold color={"green"}>
                    {loginCreateTextPrompt}
                  </CustomText>
                </Pressable>
                <Gap height={10} />
                <CustomInput onChangeText={setEmail} value={email} placeholder="email" style={{ marginTop: 5 }} />
                <CustomInput
                  onChangeText={setPassword}
                  value={password}
                  placeholder="password"
                  isPassword
                  style={{ marginTop: 5 }}
                />
                {createNewUser && (
                  <CustomInput
                    onChangeText={setPasswordConfirm}
                    value={passwordConfirm}
                    placeholder="confirm password"
                    isPassword
                    style={{ marginTop: 5 }}
                  />
                )}
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
                <CustomButton
                  onPress={() => {
                    dispatch({ name: "asyncLogoutUser" });
                  }}
                  style={{ width: 100 }}
                >
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
  settingsButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    height: 50,
  },
  backButton: { width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" },
  dividingLine: { height: 0.5, width: "100%", backgroundColor: "lightgray" },
  etListItem: {
    width: "100%",
    height: 50,
    padding: 10,
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  etListItemButtons: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end" },
});

export default Settings;
