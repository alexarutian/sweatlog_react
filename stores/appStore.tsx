import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useReducer, ReactNode } from "react";
import { postJSONFetch, getJSONFetch } from "../utilities/ajax";
import { ReducerAction, dummyTestCallback } from "./types";

const initialState = {
  exerciseList: [] as any[],
  exerciseTypeList: [] as any[],
  equipmentTypeList: [] as any[],
  workoutList: [] as any[],
  sessionList: [] as any[],
  email: null as null | string,
  userToken: null as null | string,
  currentPage: "home",
  statusCode: null as null | string,
  error: null as null | string,
  userError: null as null | string,
};

function Reducer(state: typeof initialState, action: ReducerAction): typeof initialState {
  switch (action.name) {
    case "setUserToken":
      return {
        ...state,
        userToken: action.payload,
      };
    case "setEmail":
      return {
        ...state,
        email: action.payload,
      };
    case "setExerciseList":
      return {
        ...state,
        exerciseList: action.payload,
      };
    case "setExerciseTypeList":
      return {
        ...state,
        exerciseTypeList: action.payload,
      };
      case "setEquipmentTypeList":
        return {
          ...state,
          equipmentTypeList: action.payload,
        };
    case "setWorkoutList":
      return {
        ...state,
        workoutList: action.payload,
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
              innerDispatch({ name: "setUserToken", payload: result.token });
              innerDispatch({ name: "setEmail", payload: result.email });
              //   context.userToken.set(result.token);
              try {
                await AsyncStorage.setItem("user_token", result.token);
                await AsyncStorage.setItem("user_email", result.email);
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
          innerDispatch({ name: "setUserToken", payload: null });
          innerDispatch({ name: "setEmail", payload: null });
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
              innerDispatch({ name: "setExerciseTypeList", payload: result.all_exercise_types });
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
                innerDispatch({ name: "setEquipmentTypeList", payload: result.all_equipment_types });
              },
              (error) => {
                console.log(error.message);
              }
            );
          break;
      case "getAllExercises":
        getJSONFetch("http://192.168.0.186:8000/webapp/exercises/", action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            (result) => {
              innerDispatch({ name: "setExerciseList", payload: result.all_exercises });
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;
      case "getAllWorkouts":
        getJSONFetch("http://192.168.0.186:8000/webapp/workouts/", action.payload)
          .then((res) => {
            return res.json();
          })
          .then(
            (result) => {
              innerDispatch({ name: "setWorkoutList", payload: result.all_workouts });
            },
            (error) => {
              console.log(error.message);
            }
          );
        break;
      case "getAllSessions":
        getJSONFetch("http://192.168.0.186:8000/webapp/sessions/", action.payload)
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

export const AppStore = createContext({ state: initialState, dispatch: dummyTestCallback });
