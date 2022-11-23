import dotenv from "dotenv";
dotenv.config();

import crisInfoDao from "../models/crisinfoDao";
import ICrisInputData from "../interfaces/Icrisinfo";
import Joi from "joi";
import axios from "axios";
import { erorrGenerator } from "../middlewares/errorGenerator";

const schemaCrisInfoInputData = Joi.object({
  trial_id: Joi.string()
    .pattern(/^[A-z]{3,3}\d{7,7}$/)
    .required(),
  scientific_title_kr: Joi.string().required().max(4000),
  scientific_title_en: Joi.string().required().max(4000),
  study_type_kr: Joi.string().required().max(40),
  date_registration: Joi.date().required(),
  date_updated: Joi.date(),
  primary_sponsor_kr: Joi.string().max(200),
  date_enrolment: Joi.date(),
  type_enrolment_kr: Joi.string().max(30),
  results_date_completed: Joi.string().allow(null, ""),
  results_type_date_completed_kr: Joi.string().max(30).allow(null, ""),
  i_freetext_kr: Joi.string().max(400),
  phase_kr: Joi.string().max(100).allow(null, ""),
  source_name_kr: Joi.string().max(200),
  primary_outcome_1_kr: Joi.string().max(4000),
});

const schemaInputArray = Joi.array().items(schemaCrisInfoInputData);

const schemaServiceKey = Joi.object({
  serviceKey: Joi.string().required(),
  pageNum: Joi.number().required(),
  numOfRows: Joi.number().required(),
});

/**
 * 목적: batch-process 작성
 */

/**
 * 목적: open api 에 값을 요청함
 * #########      TODO      ############
 * 1. 인증키 가져오기
 * 2. axios 로 open api 요청하기
 * 3. 값을 리턴하기
 * #########    Exception   ############
 * 1. 인증키가 없음
 * 2. axios 요청에 따른 값이 없음
 */

const getCrisInfoFromOpenAPI = async (page: number, rows: number) => {
  const serviceKey = process.env.SERVICE_KEY;

  const pageNum = page;
  const numOfRows = rows;

  await schemaServiceKey.validateAsync({ serviceKey, pageNum, numOfRows });

  const rawData = await axios({
    method: "get",
    url: `http://apis.data.go.kr/1352159/crisinfodataview/list?serviceKey=${serviceKey}&resultType=JSON&pageNo=${pageNum}&numOfRows=${numOfRows}`,
  });

  if (rawData.data.items.length === 0) {
    erorrGenerator(204, "no contents");
  }

  return rawData.data.items;
};

/**
 *목적 : 임상 데이터를 입력
 *#########      TODO      ############
 *1. req 페이지 당 출력개수 최대 50개. 모든 데이터를 입력받아야 한다.
 *2. req pageNo 가 최대 일때 까지 데이터 받아야 함.
 *3. 업데이트와 new 를 동시에 작업해야 한다.
 *4. request -> update or new ->batch task -> new :bulk insert, update: bulk update
 *5. db 에 row 가 없다면 전부 new
 *6. db 에 row 가 있다면 update 와 new 의 구분 -> 기준: unique key 의 중복
 *7. isEnd 계산
 *8. 스케쥴러 실행(일주일에 한번 업데이트)
 *9. unique key 중복 시 isUpdate 는 ture 값.
 *#########    Exception   ############
 *1. ......
 *2. ......
 *#########      Test      ############
 *1. data 중복 방지 테스트
 *2. crisInfoInputService 성공 테스트
 *3. input 이 없을 때 테스트
 *4. listRawData 이 없을 때 테스트
 */

const crisInfoInputService = async (inputData: ICrisInputData[]) => {
  await schemaInputArray.validateAsync(inputData);

  const result = await crisInfoDao.crisInfoInputDao(inputData);
  console.info(result);
  await crisInfoDao.isEndDao();

  return result;
};

const selectInputOrUpdate = async () => {
  const rows = await crisInfoDao.isEmpty("cris_info");
  const result = Number(rows[0]["COUNT(*)"]);

  return result;
};

const processData = async (getData: ICrisInputData[]) => {
  return getData.forEach((obj: ICrisInputData) => {
    if (obj.results_date_completed === "") {
      obj.results_date_completed = null;
    }
  });
};

const getDataAndBulkInsert = async (page: number, rows: number) => {
  const getData = await getCrisInfoFromOpenAPI(page, rows);
  await processData(getData);

  return await crisInfoInputService(getData);
};

const inputOperator = async () => {
  const empty = await selectInputOrUpdate();

  if (empty === 0) {
    let page = 1;
    const rows = 50;
    while (true) {
      await getDataAndBulkInsert(page, rows);
      page++;
    }
  }
};

export default {
  crisInfoInputService,
  getCrisInfoFromOpenAPI,
  selectInputOrUpdate,
  getDataAndBulkInsert,
};
