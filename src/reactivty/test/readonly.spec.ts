import { reactive, readonly } from "../reactive";

describe('readonly', () => {
  it('happy path', () => {
    let original = { foo: 1 };
    let wrapped = readonly({ foo: 1 });

    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
  });


  it('warn then call set', () => {
    console.warn = jest.fn();
    let obj = readonly({ foo: 1 });

    obj.foo = 2;
    expect(console.warn).toBeCalled();
  });
})