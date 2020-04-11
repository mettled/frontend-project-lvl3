export default class State {
  constructor(defaultState) {
    if (this.state) {
      return this.state;
    }
    this.state = defaultState;
  }

  setState(fields) {
    Object.keys(fields).forEach((key) => {
      if (this.state[key] === undefined) {
        return;
      }
      if (Array.isArray(this.state[key])) {
        if (fields[key].length === 0) {
          console.log('setState', fields, key)
          this.state[key].length = 0;
        } else {
          this.state[key].push(...fields[key]);
        }
        return;
      }
      this.state[key] = fields[key];
    });
  }

  getState(field) {
    if (!field) {
      return this.state;
    }
    return this.state[field];
  }
}
