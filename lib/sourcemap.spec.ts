import { base64VLQtoNumbers, numbersToBase64VLQ } from "./sourcemap";

test("base64VLQtoNumbers", async () => {
  expect(base64VLQtoNumbers("EAEgE")).toEqual([2, 0, 2, 64]);
  expect(base64VLQtoNumbers("ECQY")).toEqual([2, 1, 8, 12]);
  expect(base64VLQtoNumbers("UACC")).toEqual([10, 0, 1, 1]);
  expect(base64VLQtoNumbers("Sngdifa")).toEqual([9, -14851, 497, 13]);
});

test("numbersToBase64VLQ", async () => {
  expect(numbersToBase64VLQ([2, 0, 2, 64])).toEqual("EAEgE");
  expect(numbersToBase64VLQ([2, 1, 8, 12])).toEqual("ECQY");
  expect(numbersToBase64VLQ([10, 0, 1, 1])).toEqual("UACC");
  expect(numbersToBase64VLQ([9, -14851, 497, 13])).toEqual("Sngdifa");
});
