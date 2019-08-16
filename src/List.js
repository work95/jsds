function List(buffer, delim) {
  let self = {} = this;

  if (!buffer) { return; }

  // Temporary.
  let list = [];

  // Check the type of object.
  switch (Object.prototype.toString.call(buffer)) {
    // JSON object.
    case "[object Object]": 
      this.load(buffer);
      return;

    // Buffer.
    case "[object Uint8Array]":
      list = buffer.toString().split(delim);
      break;

    // Array.
    case "[object Array]":
      list = buffer;
      break;

    // String.
    case "[object String]":
      list = buffer.split(delim);
      break;
  }

  // Create JSON from array with numeric indices.
  list.map((item, i) => {
    self[i++] = item;
  });
}

List.prototype.load = function (obj) {
  let self = this;
  let keys = Object.keys(obj);
  keys.map((item) => {
    self.add(item, obj[item]);
  });
}

List.prototype.check = function (key) {
  if (!key) { return null; }
  return this.getKeys().find((item) => item.toString() === key.toString()) ? true : null;
}

/* 
 * Returns the change in size of the list.
 * 0 for not added.
 * 1 for added or updated.
 */
List.prototype.add = function (key, value) {
  let size = this.size();

  if (key) {
    this[key] = value || null;
    return this.size() - size;
  } else {
    return 0;
  }
};

/* 
 * Returns the change in size of the list. 
 * 0 for not removed.
 * 1 for removed.
 */
List.prototype.remove = function (key) {
  let size = this.size();

  if (!this.check(key)) { 
    return 0;
  } else {
    delete this[key];
    return size - this.size();
  }
};

/*
 * Returns the value of the key otherwise
 * undefined if the key does not exist.
 */
List.prototype.get = function (key) {
  return this.check(key) ? this[key] : undefined;
};

/* Returns the size of the list. */
List.prototype.size = function () {
  return this.getKeys().length;
};

/* 
 * Returns an array containing all the 
 * keys in the list. 
 */
List.prototype.getKeys = function () {
  return Object.keys(this);
};

/* 
 * Returns an array containing all the 
 * values of all the keys in the list. 
 */
List.prototype.getValues = function () {
  return this.getKeys().map((i) => this[i]);
};

module.exports = List;
