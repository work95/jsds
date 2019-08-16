"use strict";

const List = require("../src/List");

test("initialize from an object", () => {
	let obj = {a: 1, b: 2, c: 3};
	let list = new List(obj);
	expect(list.a).toBe(obj.a);
	expect(list.b).toBe(obj.b);
});

test("initialize from an array", () => {
	let list = new List([1, 2, 3]);
	expect(list["0"]).toBe(1);
	expect(list["1"]).toBe(2);
});

test("initialize from a buffer", () => {
	// Can pass a split character, if needed.
	let list = new List(Buffer.from("It's a buffer"), " ");
	expect(list["0"]).toBe("It's");
	expect(list["2"]).toBe("buffer");

	list = new List(Buffer.from("23"));
	expect(list["0"]).toBe("23");
});

test("initialize from a string", () => {
	let str = "Hello World";

	// Without split character.
	let list = new List(str);
	expect(list["0"]).toBe(str);
	expect(list["1"]).toBe(undefined);

	// With split character.
	list = new List(str, "");
	expect(list["0"]).toBe("H");
	expect(list["6"]).toBe("W");

	// With split character.
	list = new List(str, " ");
	expect(list["0"]).toBe("Hello");
	expect(list["1"]).toBe("World");
});

test("add an entry", () => {
	let list = new List();
	expect(list.size()).toBe(0);

	// At least a key should be passed.
	// Value can be undefined, it will become "null".
	expect(list.add()).toBe(0);

	// Returns the size of the updated list.
	expect(list.add(1)).toBe(1);
	expect(list["1"]).toBe(null);

	list = new List();
	list.add("key1", "value1");
	// Returns the change in size not total.
	expect(list.add("key2", "value2")).toBe(1);
	expect(list["key1"]).toBe("value1");
});

test("remove an entry", () => {
	let list = new List([1, 2, 3, 4, {a: 1}, "alsdf"]);
	expect(list.remove(3)).toBe(1);
	expect(list.remove("a")).toBe(0);
});

test("get a value", () => {
	let list = new List([1, 2, 3, 4, {a: 1}, "alsdf"]);
	expect(list.get(1)).toBe(2);
	expect(list.get(5)).toBe("alsdf");
	expect(new List({"Hello": "world"}).get("world")).toBe(undefined);
});

test("get size", () => {
	expect(new List([1, 2, 3, 3, 4, 5]).size()).toBe(6);
	expect(new List({a: 1, a: 2, a: 3}).size()).toBe(1)
});

test("get all the keys", () => {
	expect(new List().getKeys().length).toBe(0);
	let keys = new List([1, 2, 3, 4]).getKeys();
	expect(keys[0]).toBe("0");
	expect(keys[1]).toBe("1");
	keys = new List({"Hello": "world"});
	expect(keys["Hello"]).toBe("world");
});

test("get all the values", () => {
	expect(new List().getValues().length).toBe(0);
	let keys = new List({"hello": "world", "a": 1});
	expect(keys.getValues()[0]).toBe("world");
});
