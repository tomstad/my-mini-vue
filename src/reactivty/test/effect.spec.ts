import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({ age: 10 });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    })

    expect(nextAge).toBe(11)

    // update
    user.age++;
    expect(nextAge).toBe(12);



  })


  // effect 返回runner方法, 调用runner方法返回fn的返回值
  it('effect runner', () => {
    let foo = 1;

    let runner = effect(() => {
      foo++;

      return 'foo'
    })


    expect(foo).toBe(2);
    let r = runner();

    expect(foo).toBe(3);
    expect(r).toBe('foo')
  });



  // scheduler
  it('scheduler', () => {
    // 1. 传入第二个参数options包含scheduler
    // 2. scheduler首次不执行
    // 3. 响应式对象set update 操作触发scheduler,不触发fn
    // 4. 调用 runner 执行fn
    let dummy;
    let run;
    let scheduler = jest.fn(() => {
      run = runner;
    })

    let obj = reactive({ foo: 1 })
    let runner = effect(() => {
      dummy = obj.foo
    },
      { scheduler }
    );


    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);

    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);

    run();
    expect(dummy).toBe(2);
  });



  // stop
  // 1.effect返回值为入参
  // 2. set update 操作, fn不触发
  it('stop', () => {
    let dummy;
    let obj = reactive({ foo: 1});
    let runner = effect(()=>{
      dummy = obj.foo
    });

    obj.foo = 2;
    expect(dummy).toBe(2);
    // expect
    stop(runner);
    
    obj.foo = 3;
    expect(dummy).toBe(2); 
    runner();
    expect(dummy).toBe(3);
  });

  // onStop
  it('onStop', () => {
    let dummy;
    let obj = reactive({ foo: 1});
    let onStop = jest.fn(()=>{
      dummy = 10;
    })
    let runner = effect(()=>{
      dummy = obj.foo
    }, { onStop });

    obj.foo = 2;
    expect(dummy).toBe(2);
    // expect
    stop(runner);
    expect(onStop).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(10);
  });


})