import { html } from "lit-html";
import JSONElement from "./index";

customElements.define("custom-element", JSONElement);

const value = {
  array: [1, 2, 3],
  bool: true,
  date: new Date(),
  object: {
    foo: "bar",
  },
  symbol: Symbol("foo"),
  nested: [
    {
      a: [1, "2", null, undefined],
    },
  ],
};

export const object = () => html`
  <custom-element .value=${value}> </custom-element>
`;

export const story2 = () => html`
  <custom-element .value=${"just a string"}></custom-element>
`;
