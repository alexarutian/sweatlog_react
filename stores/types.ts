import React from "react";

export type ReducerAction = {
  name: string;
  payload?: any;
};

export const dummyReducerAction: React.Dispatch<ReducerAction> = () => {
  return {
    action: "",
    payload: {},
  };
};

export type ExerciseType = {
  name: string;
};

export type EquipmentType = {
  name: string;
};

export type Exercise = {
  name: string;
  id: number;
  description?: string;
  exercise_type?: ExerciseType;
  equipment_type?: EquipmentType;
};

type BlockExercise = {
  block: Block;
  exercise: Exercise;
  exercise_order: number;
  stat: Stat;
};

export type Stat = {
  sets: number;
  reps: number;
  weight_in_lb?: number;
  time_in_seconds?: number;
};

export type Block = {
  name: string;
  exercises: BlockExercise[];
};

type WorkoutBlock = {
  workout: Workout;
  block: Block;
  block_quantity: number;
  block_order: number;
};

export type Workout = {
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
