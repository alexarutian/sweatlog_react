import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useReducer, ReactNode } from "react";
import { postJSONFetch, getJSONFetch, deleteJSONFetch, putJSONFetch } from "../utilities/ajax";
import {
  ReducerAction,
  dummyTestCallback,
  EquipmentType,
  ExerciseType,
  Lookup,
  Exercise,
  Block,
  Workout,
  IncomingExercise,
  IncomingBlock,
  IncomingWorkout,
} from "./types";

const initialState = {
  exerciseTypeLookup: {} as Lookup<ExerciseType>,
  equipmentTypeLookup: {} as Lookup<EquipmentType>,
  exerciseLookup: {} as Lookup<Exercise>,
  blockLookup: {} as Lookup<Block>,
  workoutLookup: {} as Lookup<Workout>,
  sessionList: [] as any[],
  email: null as null | string,
  userToken: null as null | string,
  userId: null as null | number,
  currentPage: "home",
  statusCode: null as null | string,
  error: null as null | string,
  userError: null as null | string,
  exerciseTypeLoaded: false,
  equipmentTypeLoaded: false,
  exerciseLoaded: false,
  blockLoaded: false,
  workoutLoaded: false,
};

function Reducer(state: typeof initialState, action: ReducerAction): typeof initialState {
  switch (action.name) {
    case "setUserInfo":
      return {
        ...state,
        email: action.payload.email,
        userId: action.payload.id,
        userToken: action.payload.token,
      };
    case "clearUserInfo":
      return {
        ...state,
        email: null,
        userId: null,
        userToken: null,
      };
    case "setExerciseLookup":
      return {
        ...state,
        exerciseLookup: assembleExercises(action.payload, state),
        exerciseLoaded: true,
      };
    case "setEquipmentTypeLookup":
      return {
        ...state,
        equipmentTypeLookup: action.payload,
        equipmentTypeLoaded: true,
      };
    case "setExerciseTypeLookup":
      return {
        ...state,
        exerciseTypeLookup: action.payload,
        exerciseTypeLoaded: true,
      };
    case "setBlockLookup":
      return {
        ...state,
        blockLookup: assembleBlocks(action.payload, state),
        blockLoaded: true,
      };
    case "setWorkoutLookup":
      return {
        ...state,
        workoutLookup: assembleWorkouts(action.payload, state),
        workoutLoaded: true,
      };
    case "setSessionList":
      return {
        ...state,
        sessionList: action.payload,
      };
    case "setCurrentPage":
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return { ...state };
  }
}

type ProviderProps = {
  children: ReactNode;
};

export const AppContextProvider = (props: ProviderProps) => {
  const [state, innerDispatch] = useReducer(Reducer, initialState);
  const dispatch = React.useCallback((action: ReducerAction) => {
    switch (action.name) {
      case "asyncLoginUser":
        postJSONFetch("http://192.168.0.186:8000/webapp/users/login2/", action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            async (result) => {
              //   context.email.set(result.email);
              innerDispatch({ name: "setUserInfo", payload: result });
              try {
                await AsyncStorage.setItem("user_token", result.token);
                await AsyncStorage.setItem("user_email", result.email);
                await AsyncStorage.setItem("user_id", result.id);
              } catch (e) {
                console.log(e);
              }
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;
      case "asyncCreateUser":
        postJSONFetch("http://192.168.0.186:8000/webapp/users/", action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            async (result) => {
              //   context.email.set(result.email);
              innerDispatch({ name: "setUserInfo", payload: result });
              try {
                await AsyncStorage.setItem("user_token", result.token);
                await AsyncStorage.setItem("user_email", result.email);
                await AsyncStorage.setItem("user_id", result.id);
              } catch (e) {
                console.log(e);
              }
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;

      case "asyncLogoutUser":
        try {
          AsyncStorage.removeItem("user_token");
          AsyncStorage.removeItem("user_email");
          AsyncStorage.removeItem("user_id");
          innerDispatch({ name: "clearUserInfo" });
        } catch (e) {
          console.log(e);
        }
        break;

      case "asyncSetPage":
        try {
          AsyncStorage.setItem("last_page", action.payload);
        } catch (e) {
          console.log(e);
        }
        break;
      case "getAllExerciseTypes":
        getJSONFetch("http://192.168.0.186:8000/webapp/exercisetypes/", action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            (result) => {
              let exerciseTypeMap: { [key: number]: ExerciseType } = {};
              for (let item of result.all_exercise_types) {
                exerciseTypeMap[item.id] = item;
              }
              const lookup: Lookup<ExerciseType> = {
                list: result.all_exercise_types as unknown as ExerciseType[],
                byId: exerciseTypeMap,
              };

              innerDispatch({ name: "setExerciseTypeLookup", payload: lookup });
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;
        case "createExerciseType":
          const createExerciseTypeUrl = "http://192.168.0.186:8000/webapp/users/" + action.user + "/exercisetypes/";
          postJSONFetch(createExerciseTypeUrl, action.payload)
            .then((res) => {
              return res.json();
            })
            .then(
              (result) => {
                dispatch({
                  name: "getAllExerciseTypes",
                  payload: { user_token: action.payload.user_token },
                });
              },
              (error) => {
                console.log(error.message);
              }
            );
          break;
      case "deleteExerciseType":
        const deleteExerciseTypeUrl =
          "http://192.168.0.186:8000/webapp/users/" + action.user + "/exercisetypes/" + action.payload.itemId + "/";
        deleteJSONFetch(deleteExerciseTypeUrl, action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            (result) => {
              dispatch({
                name: "getAllExerciseTypes",
                payload: { user_token: action.payload.user_token },
              });
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;
      case "editExerciseType":
        const editExerciseTypeUrl =
          "http://192.168.0.186:8000/webapp/users/" + action.user + "/exercisetypes/" + action.payload.itemId + "/";
        putJSONFetch(editExerciseTypeUrl, action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            (result) => {
              dispatch({
                name: "getAllExerciseTypes",
                payload: { user_token: action.payload.user_token },
              });
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;

      case "getAllEquipmentTypes":
        getJSONFetch("http://192.168.0.186:8000/webapp/equipmenttypes/", action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            (result) => {
              let equipmentTypeMap: { [key: number]: EquipmentType } = {};
              for (let item of result.all_equipment_types) {
                equipmentTypeMap[item.id] = item;
              }
              const lookup: Lookup<EquipmentType> = {
                list: result.all_equipment_types as unknown as EquipmentType[],
                byId: equipmentTypeMap,
              };

              innerDispatch({ name: "setEquipmentTypeLookup", payload: lookup });
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;
      case "getAllExercises":
        const exercisesUrl = "http://192.168.0.186:8000/webapp/users/" + action.user + "/exercises/";
        getJSONFetch(exercisesUrl, action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            (result) => {
              innerDispatch({ name: "setExerciseLookup", payload: result.all_exercises });
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;
      case "createExercise":
        const createExerciseUrl = "http://192.168.0.186:8000/webapp/users/" + action.user + "/exercises/";
        postJSONFetch(createExerciseUrl, action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            (result) => {
              dispatch({
                name: "getAllExercises",
                payload: { user_token: action.payload.user_token },
                user: action.user,
              });
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;
      case "deleteExercise":
        const deleteExerciseUrl =
          "http://192.168.0.186:8000/webapp/users/" + action.user + "/exercises/" + action.payload.itemId + "/";
        deleteJSONFetch(deleteExerciseUrl, action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            (result) => {
              dispatch({
                name: "getAllExercises",
                payload: { user_token: action.payload.user_token },
                user: action.user,
              });
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;
      case "getAllWorkouts":
        const workoutsUrl = "http://192.168.0.186:8000/webapp/users/" + action.user + "/workouts/";
        getJSONFetch(workoutsUrl, action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            (result) => {
              innerDispatch({ name: "setWorkoutLookup", payload: result.all_workouts });
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;
      case "getAllBlocks":
        const blocksUrl = "http://192.168.0.186:8000/webapp/users/" + action.user + "/blocks/";
        getJSONFetch(blocksUrl, action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            (result) => {
              innerDispatch({ name: "setBlockLookup", payload: result.all_blocks });
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;
      case "getAllSessions":
        const sessionsUrl = "http://192.168.0.186:8000/webapp/users/" + action.user + "/sessions/";
        getJSONFetch(sessionsUrl, action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            (result) => {
              innerDispatch({ name: "setSessionList", payload: result.scheduled_sessions });
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;
      default:
        innerDispatch(action);
    }
  }, []);
  return <AppStore.Provider value={{ state, dispatch }}>{props.children}</AppStore.Provider>;
};

const assembleExercises = (incomingExerciseList: IncomingExercise[], state: typeof initialState) => {
  let exerciseMap: { [key: number]: Exercise } = {};
  let exerciseList = incomingExerciseList.map((exercise: IncomingExercise) => {
    let exerciseType =
      exercise.exercise_type_id == undefined ? undefined : state.exerciseTypeLookup.byId[exercise.exercise_type_id];
    let equipmentType =
      exercise.equipment_type_id == undefined ? undefined : state.equipmentTypeLookup.byId[exercise.equipment_type_id];
    const exerciseObject = {
      name: exercise.name,
      id: exercise.id,
      description: exercise.description,
      exercise_type: exerciseType,
      equipment_type: equipmentType,
    };
    exerciseMap[exercise.id] = exerciseObject;
    return exerciseObject;
  });
  const lookup: Lookup<Exercise> = { list: exerciseList as unknown as Exercise[], byId: exerciseMap };
  return lookup;
};

const assembleBlocks = (incomingBlockList: IncomingBlock[], state: typeof initialState) => {
  let blockMap: { [key: number]: Block } = {};

  let blockList: Block[] = incomingBlockList.map((block: IncomingBlock) => {
    let exercises = block.exercises.map((ex) => {
      let exercise = state.exerciseLookup.byId[ex.exercise_id];
      const exerciseObject = {
        exercise_order: ex.exercise_order,
        stats: ex.stats,
        exercise: exercise,
      };
      return exerciseObject;
    });

    const blockObject: Block = {
      name: block.name,
      id: block.id,
      exercises: exercises,
    };
    blockMap[block.id] = blockObject;
    return blockObject;
  });
  const lookup: Lookup<Block> = { list: blockList as unknown as Block[], byId: blockMap };
  return lookup;
};

const assembleWorkouts = (incomingWorkoutList: IncomingWorkout[], state: typeof initialState) => {
  let workoutMap: { [key: number]: Workout } = {};
  let workoutList: Workout[] = incomingWorkoutList.map((workout: IncomingWorkout) => {
    let blocks = workout.blocks.map((bl) => {
      let block = state.blockLookup.byId[bl.block_id];
      const blockObj = {
        block_order: bl.block_order,
        block_quantity: bl.block_quantity,
        block: block,
      };
      return blockObj;
    });
    const workoutObject: Workout = {
      name: workout.name,
      id: workout.id,
      blocks: blocks,
    };
    workoutMap[workout.id] = workoutObject;
    return workoutObject;
  });
  const lookup: Lookup<Workout> = { list: workoutList as unknown as Workout[], byId: workoutMap };
  return lookup;
};

export const AppStore = createContext({ state: initialState, dispatch: dummyTestCallback });
