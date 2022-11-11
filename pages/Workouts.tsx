import React from "react";
import { View } from "react-native";
import CustomIcon from "../components/CustomIcon";
import CustomText from "../components/CustomText";
import Gap from "../components/Gap";
import IndexCard from "../components/IndexCard";
import { AppStore } from "../stores/appStore";
import { Workout } from "../stores/types";
import { universalStyles } from "../utilities/stylevars";

const Workouts = () => {
  const { state, dispatch } = React.useContext(AppStore);
  if (state.workoutLoaded) return (
    <View style={universalStyles.page}>
      <Gap height={20} />
      <View style={{ width: "100%", alignItems: "center" }}>
        {state.workoutLookup.list.map((workout: Workout, idx: number) => (
          <>
            <IndexCard
              key={idx}
              title={workout.name}
              titleStyle={{textTransform: "uppercase", fontSize: 14 }}
              // rows={[<></>]}
              rows={workout.blocks.map((block, bidx) =>
                block.block.exercises.map((exercise, eidx) => (
                  <View
                    key={eidx + bidx}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: 50,
                      padding: 5,
                    }}
                  >
                    <CustomText>{exercise.exercise.name}</CustomText>
                    <View style={{justifyContent: "flex-end", alignItems: "center", flexDirection: "row"}}>
                    {exercise.stats.weight_lb && (
                      <View
                        style={{
                          width: 50,
                          height: 40,
                        }}
                      >
                        <View style={{position: "absolute", top: -4, alignItems: "center", justifyContent: "center", width: 50, height: 40}}><CustomIcon name="weight" iconProvider="MaterialCommunityIcons" iconSize={40} color={"rgba(60, 73, 63, 0.1)"} /></View>
                        <View style={{position: "absolute", alignItems: "center", justifyContent: "center", width: 50, height: 40}}><CustomText fontSize={13}>{exercise.stats?.weight_lb}</CustomText></View>
                      </View>
                    )}
                    {exercise.stats.reps && (
                      <View
                        style={{
                          width: 50,
                          height: 23,
                          backgroundColor: "rgba(60, 73, 63, 0.1)",
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CustomText fontSize={13}>
                          {exercise.stats?.sets | 1} x {exercise.stats?.reps}
                        </CustomText>
                      </View>
                    )}
                    {exercise.stats.time_in_seconds && (
                      <View
                        style={{
                          width: 50,
                          height: 23,
                          backgroundColor: "rgba(60, 73, 63, 0.1)",
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CustomText fontSize={13}>{exercise.stats?.time_in_seconds}</CustomText>
                      </View>
                    )}</View>
                  </View>
                ))
              )}
            />
          </>
        ))}
      </View>
    </View>
  );
};

export default Workouts;
