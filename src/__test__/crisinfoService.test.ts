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
import crisInfoService from "../services/crisinfoService";
import { createApp } from "../../app";
import IMetaData from "../interfaces/IMetaData";
import axios from "axios";

describe("비즈니스 로직 테스트", () => {
  let app;

  const example = {
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

  beforeEach(async () => {
    await database.initialize();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await database.query(`TRUNCATE cris_info`);
    await database.query(`TRUNCATE meta_data`);
    await database.destroy();
  });

  test("loggingTask: 함수 실행 결과 mataDataDao 를 호출한다", async () => {
    const data: IMetaData = {
      affectedRowsInput: 0,
      affectedRowsUpdate: 0,
      meta_id: "aaa",
    };

    crisinfoDao.mataDataDao = jest.fn<typeof crisinfoDao.mataDataDao>();

    await crisInfoService.loggingTask(data);

    expect(crisinfoDao.mataDataDao).toBeCalledTimes(1);
  });

  test("crisInfoInputService: crisInfoInputDao 함수를 호출함", async () => {
    const inputData = [example];

    crisinfoDao.crisInfoInputDao =
      jest.fn<typeof crisinfoDao.crisInfoInputDao>();

    await crisInfoService.crisInfoInputService(inputData);

    expect(crisinfoDao.crisInfoInputDao).toBeCalledTimes(1);
  });

  test("selectInputOrUpdate: cris_info 테이블에 자료가 없으므로 결과값이 0이 나와야 한다.", async () => {
    const result = await crisInfoService.selectInputOrUpdate();

    expect(result).toBe(0);
  });

  test("getCrisInfoFromOpenAPI: axios 외부 모듈 호출", async () => {
    const spyGet = jest.spyOn(axios, "get");

    await crisInfoService.getCrisInfoFromOpenAPI(1, 10);
    expect(spyGet).toBeCalledTimes(1);
  });

  test("getCrisInfoFromOpenAPI: rawData.data.items 가 텅 비었다면 error를 던진다", async () => {
    axios.get = jest.fn<any>().mockResolvedValue({ data: { items: [] } });
    await expect(crisInfoService.getCrisInfoFromOpenAPI(1, 11)).rejects.toThrow(
      "no contents"
    );
  });
});
