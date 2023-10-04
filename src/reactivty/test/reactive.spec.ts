import { reactive } from "../reactive";
describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };

    const pOriginal = reactive(original);

    expect(original === pOriginal).toBe(false);

    expect(pOriginal.foo).toBe(1);
    pOriginal.foo++;
    expect(pOriginal.foo).toBe(2);
  });
})