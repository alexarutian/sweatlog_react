import React from "react";
import {View} from "react-native";
import CustomText from "../components/CustomText";
import { AppStore } from "../stores/appStore";

 
type Workout = {
  name: string,
  id: number,
  blocks?: []
}

const Workouts = () => {
  const {state, dispatch} = React.useContext(AppStore);
  const workoutList: Workout[] = state.workoutList

    return (          
    <View>
        <CustomText bold>Workouts</CustomText>
        {workoutList.map((workout: Workout, idx: number) => (
          <CustomText key={idx}>{workout.name}</CustomText>
        ))}

      </View>)
}

export default Workouts

