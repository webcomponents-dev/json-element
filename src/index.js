export default class JSONElement extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    this.value = {};
  }

  static get styles() {
    return `
      :host {
        font-family: monospace;
      }

      details > div {
        padding-left: 15px;
      }

      .key {
        color: purple;
      }

      .value {
        color: green;
      }

      .less {
        color: grey;
      }

    `;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
      ${JSONElement.styles}
    </style>
    ${this.renderNode(undefined, this.value)}`;
  }

  //
  // Main Renders
  //

  renderNode(key, obj) {
    const type = JSONElement.objType(obj);
    switch (type) {
      case "Object":
      case "Array":
        return this.renderParent(type, key, obj);
      default:
        return this.renderKeyValue(key, this.renderValue(type, obj));
    }
  }

  renderValue(type, value) {
    switch (type) {
      case "Boolean":
        return `${value ? "true" : "false"}`;
      case "String":
        return `"${value}"`;
      case "Number":
        return `${value}`;
      case "Date":
        return `${value.toISOString()}`;
      case "Null":
        return "null";
      case "Undefined":
        return "undefined";
      case "Function":
      case "Symbol":
        return `${value.toString()}`;
      default:
        return `###unsupported yet###`;
    }
  }

  renderParent(type, key, value) {
    const summary = `<summary>${this.renderSummaryObject(
      type,
      key,
      value
    )}</summary>`;

    let details = "";
    const keys = Reflect.ownKeys(value);
    keys.forEach(key => {
      details += this.renderNode(key, value[key]);
    });

    return `<details>${summary}<div>${details}</div></details>`;
  }

  renderKeyValue(key, value) {
    return `<div>${this.renderSpanKey(key)}${this.renderSpanValue(
      value
    )}</div>`;
  }

  renderSpanKey(key) {
    return key ? `<span class="key">${key}: </span>` : "";
  }

  renderSpanValue(value) {
    return value ? `<span class="value">${value}</span>` : "";
  }

  renderSpanLessImportant(value) {
    return value ? `<span class="less">${value}</span>` : "";
  }

  //
  // Summary renders
  //

  renderSummaryObject(type, key, value) {
    const frontkey = this.renderSpanKey(key);

    let openSummary = "";
    let closeSummary = "";

    switch (type) {
      case "Object":
        openSummary = "Object: {";
        closeSummary = "}";
        break;
      case "Array":
        openSummary = "Array: [";
        closeSummary = "]";
        break;
    }

    const keys = Reflect.ownKeys(value);

    const content = keys.reduce((accu, key, index) => {
      if (index > 5) return accu;
      if (index == 5) return accu + ` ${this.renderSpanLessImportant("...")}`;
      // less than 5 items show in summary
      const child = value[key];
      return (
        accu + ` ${this.renderSpanKey(key)}${this.renderSummaryValue(child)}`
      );
    }, "");

    return `${frontkey}${openSummary} ${content} ${closeSummary}`;
  }

  renderSummaryValue(value) {
    const type = JSONElement.objType(value);
    switch (type) {
      case "Object":
        return this.renderSpanLessImportant("{...}");
      case "Array":
        return this.renderSpanLessImportant("[...]");
      default:
        return this.renderSpanValue(this.renderValue(type, value));
    }
  }

  //
  // Tools
  //

  static objType(obj) {
    const type = Object.prototype.toString.call(obj).slice(8, -1);
    if (type === "Object") {
      if (typeof obj[Symbol.iterator] === "function") {
        return "Iterable";
      }
      return obj.constructor.name;
    }

    return type;
  }
}
