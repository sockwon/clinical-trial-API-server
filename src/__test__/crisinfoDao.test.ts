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

describe("crisinfoDao test suite: 읽기", () => {
  const example = [
    {
      primary_sponsor_kr: "전북대학교병원",
      source_name_kr: "헬릭스미스",
      phase_kr: "해당사항없음",
      date_registration: "2015-11-24",
      study_type_kr: "중재연구",
      type_enrolment_kr: "실제등록",
      results_type_date_completed_kr: "예정",
      i_freetext_kr: "식이보충제",
      results_date_completed: "2016-12-29",
      trial_id: "KCT0007932",
      scientific_title_kr:
        "HX112의 여성 갱년기 증상 개선에 대한 유효성 및 안전성을 평가하기 위한 12주, 무작위배정, 이중눈가림, 위약 대조 인체적용시험",
      primary_outcome_1_kr: "쿠퍼만 갱년기 지수",
      date_updated: "2022-11-09",
      date_enrolment: "2022-04-27",
      scientific_title_en:
        "A 12-week randomized, double-blind, placebo-controlled clinical trial to evaluate the efficacy and safety of HX112 on menopausal symptoms.",
    },

    {
      primary_sponsor_kr: "전북대학교병원",
      source_name_kr: "상지대학교",
      phase_kr: "해당사항없음",
      date_registration: "2022-11-22",
      study_type_kr: "중재연구",
      type_enrolment_kr: "실제등록",
      results_type_date_completed_kr: "예정",
      i_freetext_kr: "의약품",
      results_date_completed: "2023-05-31",
      trial_id: "KCT0007930",
      scientific_title_kr:
        "건강한 성인에서 경방소시호탕과 합성의약품 3 종 (Amoxicillin/Clavulanate, Clarithromycin, Loxoprofen)의 상호작용을 평가하기 위한 공개, 단회/반복투여, 단일 순서군, 3-치료군, 교차 임상시험 ",
      primary_outcome_1_kr:
        "Amoxicillin, clavulanic acid, clartithromycin 및 loxoprofen의 AUCt, Cmax",
      date_updated: "2022-11-08",
      date_enrolment: "2022-06-08",
      scientific_title_en:
        "An open, single／multiple dosing, one-sequence, three-treatment, crossover study to evaluate the drug-drug interaction between herbal medicine(Sosiho-tang) and three chemical drugs (amoxicillin／clavulanate, clarithromycin, loxoprofen) in healthy volunteers",
    },
  ];

  beforeAll(async () => {
    await database.initialize();
    await database
      .createQueryBuilder()
      .insert()
      .into(CrisInfo)
      .values(example)
      .execute();
  });

  afterAll(async () => {
    await database.query(`TRUNCATE TABLE cris_info`);
    await database.destroy();
  });

  test("현재 2개의 데이터가 테이블에 있으므로 반환값은 2이 나와야 한다.", async () => {
    const value = await crisinfoDao.isEmptyDao("cris_info");
    const result = value[0]["COUNT(*)"];

    expect(result).toBe("2");
  });
});

describe("crisinfoDao test suite: 쓰기", () => {
  const example = [
    {
      primary_sponsor_kr: "전북대학교병원",
      source_name_kr: "헬릭스미스",
      phase_kr: "해당사항없음",
      date_registration: new Date("2015-11-24"),
      study_type_kr: "중재연구",
      type_enrolment_kr: "실제등록",
      results_type_date_completed_kr: "예정",
      i_freetext_kr: "식이보충제",
      results_date_completed: "2016-12-29",
      trial_id: "KCT0007932",
      scientific_title_kr:
        "HX112의 여성 갱년기 증상 개선에 대한 유효성 및 안전성을 평가하기 위한 12주, 무작위배정, 이중눈가림, 위약 대조 인체적용시험",
      primary_outcome_1_kr: "쿠퍼만 갱년기 지수",
      date_updated: new Date("2022-11-09"),
      date_enrolment: new Date("2022-04-27"),
      scientific_title_en:
        "A 12-week randomized, double-blind, placebo-controlled clinical trial to evaluate the efficacy and safety of HX112 on menopausal symptoms.",
    },

    {
      primary_sponsor_kr: "전북대학교병원",
      source_name_kr: "상지대학교",
      phase_kr: "해당사항없음",
      date_registration: new Date("2022-11-22"),
      study_type_kr: "중재연구",
      type_enrolment_kr: "실제등록",
      results_type_date_completed_kr: "예정",
      i_freetext_kr: "의약품",
      results_date_completed: "2023-05-31",
      trial_id: "KCT0007930",
      scientific_title_kr:
        "건강한 성인에서 경방소시호탕과 합성의약품 3 종 (Amoxicillin/Clavulanate, Clarithromycin, Loxoprofen)의 상호작용을 평가하기 위한 공개, 단회/반복투여, 단일 순서군, 3-치료군, 교차 임상시험 ",
      primary_outcome_1_kr:
        "Amoxicillin, clavulanic acid, clartithromycin 및 loxoprofen의 AUCt, Cmax",
      date_updated: new Date("2022-11-08"),
      date_enrolment: new Date("2022-06-08"),
      scientific_title_en:
        "An open, single／multiple dosing, one-sequence, three-treatment, crossover study to evaluate the drug-drug interaction between herbal medicine(Sosiho-tang) and three chemical drugs (amoxicillin／clavulanate, clarithromycin, loxoprofen) in healthy volunteers",
    },
  ];

  beforeEach(async () => {
    await database.initialize();
    await database
      .createQueryBuilder()
      .insert()
      .into(CrisInfo)
      .values(example)
      .execute();
  });

  afterEach(async () => {
    await database.query(`TRUNCATE TABLE cris_info`);
    await database.destroy();
  });

  test("unique 키가 중복인 경우를 제외하고 row 추가", async () => {
    const rows: ICrisInputData[] = [
      {
        primary_sponsor_kr: "전북대학교병원",
        source_name_kr: "헬릭스미스",
        phase_kr: "해당사항없음",
        date_registration: new Date("2015-11-24"),
        study_type_kr: "중재연구",
        type_enrolment_kr: "실제등록",
        results_type_date_completed_kr: "예정",
        i_freetext_kr: "식이보충제",
        results_date_completed: "2016-12-29",
        trial_id: "KCT0007932",
        scientific_title_kr:
          "HX112의 여성 갱년기 증상 개선에 대한 유효성 및 안전성을 평가하기 위한 12주, 무작위배정, 이중눈가림, 위약 대조 인체적용시험",
        primary_outcome_1_kr: "쿠퍼만 갱년기 지수",
        date_updated: new Date("2022-11-09"),
        date_enrolment: new Date("2022-04-27"),
        scientific_title_en:
          "A 12-week randomized, double-blind, placebo-controlled clinical trial to evaluate the efficacy and safety of HX112 on menopausal symptoms.",
      },
      {
        primary_sponsor_kr: "가톨릭대학교 은평성모병원",
        source_name_kr: "가톨릭대학교 은평성모병원",
        results_date_completed: "2023-09-14",
        scientific_title_kr:
          "요추 통증 환자에서의 경막외조영술 영상 분석을 이용한 통증강도 및 치료예후의 머신러닝 기반 평가 모델 제작.",
        trial_id: "KCT0007931",
        primary_outcome_1_kr: "조영제의 퍼짐 정도",
        date_updated: new Date("2022-11-09"),
        date_registration: new Date("2022-11-24"),
        study_type_kr: "관찰연구",
        date_enrolment: new Date("2022-11-21"),
        scientific_title_en:
          "Building a machine learning-based evaluation model of pain intensity and treatment prognosis by analyzing epidurogram contrast patterns in patients with lumbar spinal pain.",
        type_enrolment_kr: "예정",
        results_type_date_completed_kr: "예정",
        i_freetext_kr: "",
        phase_kr: "해당사항없음",
      },
    ];
    const result = await crisinfoDao.crisInfoAddDao(rows);
    expect(result.raw.affectedRows).toBe(1);
  });

  test("bulk insert 를 한다", async () => {
    await database.query(`TRUNCATE cris_info`);
    const result = await crisinfoDao.crisInfoInputDao(example);
    expect(result.raw.affectedRows).toBe(2);
  });

  test("date_updated 가 업데이트 됐다면 자료를 업데이트 한다", async () => {
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

    const result = await crisinfoDao.crisInfoUpdateDao(example);
    const value = await database
      .getRepository(CrisInfo)
      .createQueryBuilder("crisInfo")
      .where("crisInfo.trial_id =:trial_id", { trial_id: "KCT0007930" })
      .execute();
    expect(result.affected).toBe(1);
    expect(value[0].crisInfo_study_type_kr).toBe("테스트대상1");
    expect(value[0].crisInfo_type_enrolment_kr).toBe("테스트대상2");
    expect(value[0].crisInfo_results_type_date_completed_kr).toBe(
      "테스트대상3"
    );
  });
});
