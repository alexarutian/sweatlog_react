import React from "react";
import {View} from "react-native";
import CustomText from "../components/CustomText";
import { AppStore } from "../stores/appStore";
import { Workout } from "../stores/types";


const Workouts = () => {
  const {state, dispatch} = React.useContext(AppStore);

    return (          
    <View>
        <CustomText bold>Workouts</CustomText>
        {state.workoutList.map((workout: Workout, idx: number) => (
          <CustomText key={idx}>{workout.name}</CustomText>
        ))}

      </View>)
}

export default Workouts

