import React from "react";
import {View} from "react-native";
import CustomText from "../components/CustomText";
import { AppStore } from "../stores/appStore";
 
type Exercise = {
  name: string,
  id: number,
  description: string
}

const Exercises = () => {
  const {state, dispatch} = React.useContext(AppStore);
  const exerciseList: Exercise[] = state.exerciseList

    return (          
    <View>
        <CustomText bold>Exercises:</CustomText>
        <View>
        {exerciseList.map((exercise: Exercise, idx: number) => (
          <CustomText key={idx}>{exercise.name}</CustomText>
        ))}
        </View>
      </View>)
}

export default Exercises