import AsyncStorage from "@react-native-async-storage/async-storage";

export function getJSONFetch(url, params) {
  let headers = new Headers();
  headers.append("Accept", "application/json");

  if (params.json !== undefined) {
    params.json = JSON.stringify(params.json);
  }
  // url = new URL(url, document.location);
  // url.search = new URLSearchParams(params).toString();

  url = url + "?" + new URLSearchParams(params).toString();

  return fetch(url, { headers, method: "GET" });
}

export function postJSONFetch(url, body) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
}

export function deleteJSONFetch(url, body) {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");

  return fetch(url, {
    method: "DELETE",
    headers,
    body: JSON.stringify(body),
  });
}

export function putJSONFetch(url, body) {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");

  return fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
}

const userErrorMessages = {
  logs: {
    post: {
      409: "You have already logged this project today!",
    },
  },
};

function generateUserErrorMessage(code, verb, resource) {
  let message = userErrorMessages[resource][verb][code];
  return message;
}

////////////////////////////////////////////////////////////////////

const getAllExercises = (context, params) => {
  getJSONFetch("http://192.168.0.186:8000/webapp/exercises/", params)
    .then((res) => {
      context.statusCode.set(res.status);
      return res.json();
    })
    .then(
      (result) => {
        context.exerciseList.set(result.all_exercises);
        context.error.set(null);
      },
      (error) => {
        context.error.set(error.message);
      }
    );
};

const getAllWorkouts = (context, params) => {
  getJSONFetch("http://192.168.0.186:8000/webapp/workouts/", params)
    .then((res) => {
      context.statusCode.set(res.status);
      return res.json();
    })
    .then(
      (result) => {
        context.workoutList.set(result.all_workouts);
        context.error.set(null);
      },
      (error) => {
        context.error.set(error.message);
      }
    );
};

const createNewProject = (context, body) => {
  postJSONFetch("http://192.168.0.186:8000/backend/projects/", body)
    .then((res) => {
      context.statusCode.set(res.status);
      return res.json();
    })
    .then(
      (result) => {
        // itemsObj.set(result.project_id);
        context.error.set(null);
      },

      (error) => {
        context.error.set(error.message);
      }
    )
    .then(getAllProjects(context, { user_token: context.userToken.value }));
};

const deleteProject = (context, body) => {
  deleteJSONFetch("http://192.168.0.186:8000/backend/projects/", body)
    .then((res) => {
      context.statusCode.set(res.status);
      context.userError.set(generateUserErrorMessage(res.status, "delete", "projects"));
      return res.json();
    })
    .then(
      (result) => {
        context.error.set(null);
      },
      (error) => {
        context.error.set(error);
      }
    )
    .then(getAllProjects(context, { user_token: context.userToken.value }));
};

const getAllLogs = (context, params) => {
  getJSONFetch("http://192.168.0.186:8000/backend/logs/", params)
    .then((res) => {
      context.statusCode.set(res.status);
      return res.json();
    })
    .then(
      (result) => {
        context.logList.set(result.all_logs);
        context.logListByProject.set(result.all_logs_by_project);
        context.error.set(null);
      },
      (error) => {
        context.error.set(error.message);
      }
    );
};

const createNewLog = (context, body) => {
  postJSONFetch("http://192.168.0.186:8000/backend/logs/", body)
    .then((res) => {
      context.statusCode.set(res.status);
      context.userError.set(generateUserErrorMessage(res.status, "post", "logs"));
      return res.json();
    })
    .then(
      (result) => {
        context.latestLog.set(result.log_id);
        context.error.set(null);
      },

      (error) => {
        context.error.set(error);
      }
    )
    .then(getAllLogs(context, { user_token: context.userToken.value }));
};

const deleteLog = (context, body) => {
  deleteJSONFetch("http://192.168.0.186:8000/backend/logs/", body)
    .then((res) => {
      context.statusCode.set(res.status);
      context.userError.set(generateUserErrorMessage(res.status, "delete", "logs"));
      return res.json();
    })
    .then(
      (result) => {
        // improve this - index and delete?
        // let filteredLogs = context.LogList.filter((log) => log.id !== result.log_id);
        // context.logList.set(filteredLogs);
        context.error.set(null);
      },
      (error) => {
        context.error.set(error);
      }
    )
    .then(getAllLogs(context, { user_token: context.userToken.value }));
};

const loginUser = (context, body) => {
  postJSONFetch("http://192.168.0.186:8000/webapp/users/login2/", body)
    .then((res) => {
      context.statusCode.set(res.status);
      return res.json();
    })
    .then(
      (result) => {
        context.email.set(result.email);
        context.userToken.set(result.token);
        storeToken(context, result.token, result.email).then(() => {
          context.error.set(null);
        });
      },
      (error) => {
        context.error.set(error.message);
      }
    );
};

const createNewUser = (context, body) => {
  postJSONFetch("http://192.168.0.186:8000/backend/users/", body)
    .then((res) => {
      context.statusCode.set(res.status);
      return res.json();
    })
    .then(
      (result) => {
        context.email.set(result.email);
        context.userToken.set(result.token);
        storeToken(context, result.token, result.email).then(() => {
          context.error.set(null);
        });
      },
      (error) => {
        context.error.set(error.message);
      }
    );
};

export const storeToken = async (context, userToken, email) => {
  try {
    await AsyncStorage.setItem("user_token", userToken);
    await AsyncStorage.setItem("user_email", email);
  } catch (e) {
    context.error.set(e.message);
  }
};

export const deleteToken = async (context) => {
  try {
    await AsyncStorage.removeItem("user_token");
    await AsyncStorage.removeItem("user_email");
  } catch (e) {
    context.error.set(e.message);
  }
};

///////////////////////////////////////////////////////////////////

const backendButler = {
  exercises: { getAllExercises, getAllWorkouts, createNewProject, deleteProject },
  workouts: { getAllWorkouts },
  logs: { getAllLogs, createNewLog, deleteLog },
  users: { loginUser, createNewUser, deleteToken },
};

export { backendButler };
