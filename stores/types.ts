import React from "react";

export type ReducerAction = {
  name: string;
  payload?: any;
  user?: any
};

export const dummyReducerAction: React.Dispatch<ReducerAction> = () => {
  return {
    action: "",
    payload: {},
  };
};

export type ExerciseType = {
  name: string;
  id: number;
};

export type EquipmentType = {
  name: string;
  id: number
};

export type Exercise = {
  name: string;
  id: number;
  description?: string;
  exercise_type?: ExerciseType;
  equipment_type?: EquipmentType;
};

export type IncomingExercise = {
  name: string;
  id: number;
  description?: string;
  exercise_type_id?: number;
  equipment_type_id?: number
}

type BlockExercise = {
  exercise: Exercise;
  exercise_order: number;
  stats: Stat;
};

export type Stat = {
  sets: number;
  reps: number;
  weight_lb?: number;
  time_in_seconds?: number;
};

export type IncomingBlock = {
  id: number;
  name: string;
  exercises: {exercise_id: number, exercise_order: number, stats: Stat}[]
}

export type Block = {
  id: number,
  name: string;
  exercises: BlockExercise[];
};

type WorkoutBlock = {
  block: Block;
  block_quantity?: number;
  block_order?: number;
};

export type IncomingWorkout = {
  id: number,
  name: string,
  blocks: {block_id: number, block_quantity: number, block_order: number}[]
}

export type Workout = {
  id: number;
  name: string;
  blocks: WorkoutBlock[];
};

export type Session = {
  date: string;
  workout: Workout;
};

export type TestCallback = (action: ReducerAction) => void;
export const dummyTestCallback = (action: ReducerAction) => {
  return;
};

// e.g. Lookup of Exercises will have a list of Exercises and a byId object of exercises
export type Lookup<T> = {
  list: T[];
  byId: {[key: number]: T}
}