import { track, trigger } from "./effect";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true)

function createGetter(isReadOnly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    if (!isReadOnly) {
      // 收集依赖
      track(target, key)
    }
    return res
  }
}


function createSetter() {
  return function set(target, key, value){
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res
  }
}



export const mutableHandler = {
  get,
  set
}


export const readonlyHandler = {
  get: readonlyGet,
  set(target, key, value){
    console.warn(`key: ${key} set 失败, 因为 target 是 readonly`);
    return true
  }
}