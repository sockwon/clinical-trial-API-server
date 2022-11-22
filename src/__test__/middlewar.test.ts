import dotenv from "dotenv";
dotenv.config();

import { erorrGenerator } from "../middlewares/errorGenerator";

import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  jest,
} from "@jest/globals";
import { createApp } from "../../app";

describe("middlware test:", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("error Generator: statuscode", () => {
    try {
      erorrGenerator(999);
    } catch (err: any) {
      expect(err.statusCode).toBe(999);
    }
  });

  test("error Generator: message", () => {
    try {
      erorrGenerator(999, "test");
    } catch (err: any) {
      expect(err.message).toBe("test");
    }
  });
});
