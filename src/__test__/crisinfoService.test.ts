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
import crisinfoDao from "../models/crisinfoDao";
import ICrisInputData from "../interfaces/Icrisinfo";
import crisInfoService from "../services/crisinfoService";
import { createApp } from "../../app";
import IMetaData from "../interfaces/IMetaData";
import axios from "axios";
import request from "supertest";
import CrisInfo from "../entity/Crisinfo";

const example: ICrisInputData = {
  primary_sponsor_kr: "전북대학교병원",
  source_name_kr: "상지대학교",
  phase_kr: "해당사항없음",
  date_registration: new Date("2022-11-22"),
  study_type_kr: "테스트대상1",
  type_enrolment_kr: "테스트대상2",
  results_type_date_completed_kr: "테스트대상3",
  i_freetext_kr: "의약품",
  results_date_completed: "2023-05-31",
  trial_id: "KCT0007930",
  scientific_title_kr:
    "건강한 성인에서 경방소시호탕과 합성의약품 3 종 (Amoxicillin/Clavulanate, Clarithromycin, Loxoprofen)의 상호작용을 평가하기 위한 공개, 단회/반복투여, 단일 순서군, 3-치료군, 교차 임상시험 ",
  primary_outcome_1_kr:
    "Amoxicillin, clavulanic acid, clartithromycin 및 loxoprofen의 AUCt, Cmax",
  date_updated: new Date("2022-11-10"),
  date_enrolment: new Date("2022-06-08"),
  scientific_title_en:
    "An open, single／multiple dosing, one-sequence, three-treatment, crossover study to evaluate the drug-drug interaction between herbal medicine(Sosiho-tang) and three chemical drugs (amoxicillin／clavulanate, clarithromycin, loxoprofen) in healthy volunteers",
};

describe("비즈니스 로직 테스트", () => {
  let app: any;

  beforeAll(async () => {
    app = createApp();
    await database.initialize();
    await database
      .createQueryBuilder()
      .insert()
      .into(CrisInfo)
      .values([example])
      .execute();
  });

  afterAll(async () => {
    await database.query(`TRUNCATE cris_info`);
    await database.query(`TRUNCATE meta_data`);
    await database.destroy();
  });

  test("get list 테스트 : 성공", async () => {
    const res = await request(app)
      .get("/api/v1/crisinfo/list")
      .query({ pageNum: 1 });
    expect(res.status).toBe(200);
    expect(res.body[0]).toEqual({
      date_registration: "2022-11-22",
      date_updated: "2022-11-10",
      isNew: true,
      isUpdate: false,
      scientific_title_kr:
        "건강한 성인에서 경방소시호탕과 합성의약품 3 종 (Amoxicillin/Clavulanate, Clarithromycin, Loxoprofen)의 상호작용을 평가하기 위한 공개, 단회/반복투여, 단일 순서군, 3-치료군, 교차 임상시험 ",
      trial_id: "KCT0007930",
    });
  });

  test("get list view 테스트 : 성공", async () => {
    const res = await request(app)
      .get("/api/v1/crisinfo/list/view")
      .query({ trial_id: "KCT0007930" });
    expect(res.status).toBe(200);
    expect(res.body.trial_id).toBe("KCT0007930");
  });

  test("get detail 테스트: 성공", async () => {
    const res = await request(app)
      .get("/api/v1/crisinfo/detail")
      .query({ trial_id: "KCT0007930" });
    expect(res.status).toBe(200);
    expect(res.body.scientific_title_kr).toBe(
      "건강한 성인에서 경방소시호탕과 합성의약품 3 종 (Amoxicillin/Clavulanate, Clarithromycin, Loxoprofen)의 상호작용을 평가하기 위한 공개, 단회/반복투여, 단일 순서군, 3-치료군, 교차 임상시험 "
    );
  });

  test("get list search 테스트 : 성공", async () => {
    const res = await request(app)
      .get("/api/v1/crisinfo/list/search")
      .query({ searchText: "전북대학교병원", pageNum: 1 });
    expect(res.status).toBe(200);
    expect(res.body[0].trial_id).toBe("KCT0007930");
  });
});
