import { extend } from "../shared"

class ReactiveEffect {
  private _fn: Function
  active = true
  deps = []
  public scheduler?: Function | undefined
  onStop?: Function | undefined
  constructor(fn: Function, scheduler) {
    this._fn = fn
    this.scheduler = scheduler
  };

  run() {
    activeEffect = this;
    return this._fn()
  }

  stop() {
    if (this.active) {
      clearupEffect(this);
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }     
  }
}

function clearupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
}

const targetMap = new Map();
export function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) { // 初始化 
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  if (!activeEffect) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep)
}


export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

let activeEffect;
export function effect(fn: Function, options: any = {}) {

  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options)
  _effect.run()

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner
}

export function stop(runner) {
  runner.effect.stop();
}
