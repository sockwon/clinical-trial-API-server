import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";

import database from "../models/database";
import CrisInfo from "../entity/Crisinfo";
import crisinfoDao from "../models/crisinfoDao";
import ICrisInputData from "../interfaces/Icrisinfo";
