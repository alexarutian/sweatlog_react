import React from "react"

export type ReducerAction = {
    name: string,
    payload?: any
}

export const dummyReducerAction: React.Dispatch<ReducerAction> = () => {
    return {
        action: "",
        payload: {}
    }
}

export type TestCallback = (action: ReducerAction) => void
export const dummyTestCallback = (action: ReducerAction) => {return}