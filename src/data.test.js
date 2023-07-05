import data from "./data.json";
import dots from "./dots.json";

describe("dataset(s)", () => {
  const main_dataset = [];
  const dots_dataset = [];

  beforeAll(() => {
    data.data.forEach((element) => {
      let charList = element.chars;
      charList.forEach((item) => {
        if (item.h !== "" && item.k !== "") {
          main_dataset.push(item);
        }
      });
    });

    dots.data.forEach((element) => {
      let charList = element.chars;
      charList.forEach((item) => {
        if (item.h !== "" && item.k !== "") {
          dots_dataset.push(item);
        }
      });
    });
  });

  it("have valid data", () => {
    expect(main_dataset).toBeTruthy();
    expect(dots_dataset).toBeTruthy();
    expect(main_dataset.length).toBeGreaterThan(0);
    expect(dots_dataset.length).toBeGreaterThan(0);
  });

  it("has no hiragana duplicates", () => {
    let arr = getArrayByKey("h", main_dataset);
    expect(arr).toBeTruthy();
    expect(arr.length).toBeGreaterThan(0);
    expect(hasDuplicates(arr)).toEqual(false);
  });

  it("has no katakana duplicates", () => {
    let arr = getArrayByKey("k", main_dataset);
    expect(arr).toBeTruthy();
    expect(arr.length).toBeGreaterThan(0);
    expect(hasDuplicates(arr)).toEqual(false);
  });
});

describe("Util checks", () => {
  const dupe_arr = [1, 1, 2];
  const unique_arr = [1, 2, 3];
  it("has positive duplicate boolean", () => {
    const result = hasDuplicates(dupe_arr);
    expect(result).toEqual(true);
  });

  it("has negative duplicate boolean", () => {
    const result = hasDuplicates(unique_arr);
    expect(result).toEqual(false);
  });

  it("finds duplicates in duplicate array", () => {
    const result = findDuplicates(dupe_arr);
    expect(result.length).toBeGreaterThan(0);
  });

  it("finds no duplicates in unique array", () => {
    const result = findDuplicates(unique_arr);
    expect(result.length).toEqual(0);
  });
});

const findDuplicates = (arry) =>
  arry.filter((item, index) => arry.indexOf(item) !== index);

const hasDuplicates = (array) => {
  return new Set(array).size !== array.length;
};

const getArrayByKey = (key, arr) => {
  let result = [];
  arr.forEach((e) => {
    result.push(e[key]);
  });
  return result;
};
