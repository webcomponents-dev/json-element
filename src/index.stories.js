import { html } from "lit-html";

const value = {
  array: [1, 2, 3],
  bool: true,
  date: new Date(),
  object: {
    foo: "bar"
  },
  symbol: Symbol("foo"),
  nested: [
    {
      a: [1, "2", null, undefined]
    }
  ]
};

console.log(value);

export const story1 = () => html`
  <custom-element .value=${value}> </custom-element>
`;
