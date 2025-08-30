import { all } from "redux-saga/effects";
import { repoSaga } from "./repoSaga";

export default function* rootSaga() {
  yield all([
    repoSaga(),
  ]);
}
