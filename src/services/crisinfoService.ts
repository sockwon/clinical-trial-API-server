import dotenv from "dotenv";
dotenv.config();

import crisInfoDao from "../models/crisinfoDao";
import ICrisInputData from "../interfaces/Icrisinfo";
import Joi from "joi";
import axios from "axios";
import { erorrGenerator } from "../middlewares/errorGenerator";
import PQueue from "p-queue";
import { logger } from "../../config/winston";
import IMetaData from "../interfaces/IMetaData";
import cron from "node-cron";

/**
 * 목적: validation data
 * 외부모듈인 Joi 사용
 */

const schemaCrisInfoInputData = Joi.object({
  trial_id: Joi.string()
    .pattern(/^[A-z]{3,3}\d{7,7}$/)
    .required(),
  scientific_title_kr: Joi.string().required().max(4000),
  scientific_title_en: Joi.string().required().max(4000),
  study_type_kr: Joi.string().required().max(40),
  date_registration: Joi.date().required(),
  date_updated: Joi.date().allow(null, ""),
  primary_sponsor_kr: Joi.string().max(200).allow(null, ""),
  date_enrolment: Joi.date().allow(null, ""),
  type_enrolment_kr: Joi.string().max(30).allow(null, ""),
  results_date_completed: Joi.string().allow(null, ""),
  results_type_date_completed_kr: Joi.string().max(30).allow(null, ""),
  i_freetext_kr: Joi.string().max(400).allow(null, ""),
  phase_kr: Joi.string().max(100).allow(null, ""),
  source_name_kr: Joi.string().max(200).allow(null, ""),
  primary_outcome_1_kr: Joi.string().max(4000).allow(null, ""),
});

const schemaInputArray = Joi.array().items(schemaCrisInfoInputData);

const schemaServiceKey = Joi.object({
  serviceKey: Joi.string().required(),
  pageNum: Joi.number().integer().positive().min(1).required(),
  numOfRows: Joi.number().required(),
});

const schemaGetList = Joi.object({
  pageNum: Joi.number().integer().positive().min(1).required(),
});

const schemaGetListView = Joi.object({
  trialId: Joi.string()
    .pattern(/^[A-z]{3,3}\d{7,7}$/)
    .required(),
});

const schemaGetListBySearch = Joi.object({
  pageNum: Joi.number().integer().positive().min(1).required(),
  searchText: Joi.string().allow(null, ""),
});

/**
 * 결과값을 logging
 */

//FIXME: loggingTask 가 update 작업보다 앞서 실행된다. 고치자
const loggingTask = async (data: IMetaData) => {
  const uniqueKey = new Date().toISOString().substring(0, 10).replace(/-/g, "");
  data.meta_id = uniqueKey;

  await crisInfoDao.mataDataDao(data);
  logger.info(`loggerTask activated ${uniqueKey}`);
};

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

  const rawData = await axios.get(
    `http://apis.data.go.kr/1352159/crisinfodataview/list?serviceKey=${serviceKey}&resultType=JSON&pageNo=${pageNum}&numOfRows=${numOfRows}`
  );

  if (rawData.data.items.length === 0) {
    erorrGenerator(204, "no contents");
  }

  return rawData.data.items;
};

const checkTotalCountOfCris = async () => {
  const serviceKey = process.env.SERVICE_KEY;
  const rawData = await axios({
    method: "get",
    url: `http://apis.data.go.kr/1352159/crisinfodataview/list?serviceKey=${serviceKey}&resultType=JSON&pageNo=1&numOfRows=1`,
  });

  return rawData.data.totalCount;
};

/**
 * open api 임상DB 에서 상세 읽기
 */

const getCrisDetailFromOpenAPI = async (trialId: string) => {
  const serviceKey = process.env.SERVICE_KEY;
  const rawData = await axios({
    method: "get",
    url: `http://apis.data.go.kr/1352159/crisinfodataview/detail?serviceKey=${serviceKey}&resultType=JSON&crisNumber=${trialId}`,
  });
  return rawData.data;
};

/**
 * 실행이 완료되면 추가된 건 수, 업데이트 된 건 수를 출력하거나 따로 로깅해줘야함
 * #########      TODO      ############
 * 1.실행함수에서 값을 집계한다. 집계가 끝나면
 */

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
  return result;
};

const difference = async () => {
  const rows = await crisInfoDao.isEmptyDao("cris_info");
  const numsOfRows = Number(rows[0]["COUNT(*)"]);
  const totalCount = await checkTotalCountOfCris();

  const result = {
    numsOfRows,
    diffrence: totalCount - numsOfRows,
  };

  return result;
};

const selectInputOrUpdate = async () => {
  const value = await difference();

  if (value.numsOfRows === 0) return 0;
  if (value.diffrence > 50) return 0;

  return true;
};

const processData = async (getData: ICrisInputData[]) => {
  return getData.forEach((obj: ICrisInputData) => {
    if (obj.results_date_completed === "") {
      obj.results_date_completed = null;
    }
  });
};

const getData = async (page: number, rows: number) => {
  const getData = await getCrisInfoFromOpenAPI(page, rows);
  await processData(getData);

  return getData;
};

const bulkInsert = async (page: number, rows: number) => {
  console.log("page:", page);
  const data = await getData(page, rows);
  const result = await crisInfoInputService(data);
  const value: IMetaData = {
    affectedRowsInput: result.raw.affectedRows,
    affectedRowsUpdate: 0,
  };

  await loggingTask(value);
};

/**
 * 목적: update
 * #########      TODO      ############
 * 1. bulkinsert 처럼 open api 의 모든 임상 정보를 가져온다. 단 batch process 에 따라서 50개씩
 * 2. 50개의 batch 를 on duplicate on 으로 insert 한다. update 라면 isUpdate 칼럼을 true 로 한다.
 * 3. 잊지말고 isNew 를 false 로 해줘야 한다. 새벽에 한다. 일주일 단위로 업데이트 한다.
 * 4. isEnd 업데이트도 같이 한다.
 */

const calculator = async (numsOfRows: number) => {
  const total = await checkTotalCountOfCris();
  const iteration = Math.floor(total / numsOfRows);
  return iteration;
};

const updateOneByOne = async (inputData: ICrisInputData[]) => {
  inputData.forEach(async (data) => {
    const result: any = await crisInfoDao.crisInfoUpdateDao(data);
    if (result.affected != 0) {
      const value: IMetaData = {
        affectedRowsUpdate: result.affected,
        affectedRowsInput: 0,
      };
      await loggingTask(value);
    }
  });
};

const bulkUpdate = async (page: number, rows: number) => {
  console.log("page:", page);
  const data = await getData(page, rows);
  return await updateOneByOne(data);
};

const bulkAdd = async (page: number, rows: number) => {
  logger.info("activate bulkadd");
  const data = await getData(page, rows);
  const result = await crisInfoDao.crisInfoInputDao(data);

  return result.raw.affectedRows;
};

/**
 * 목적: batch-process 작성
 * #########      TODO      ############
 * 1. 스케쥴러가 batch 실행 | api post 요청
 * 2. 유휴시간대를 선택 | 관리자 등이 요청
 * 3. batch 는 다수의 작업을 일정하게 나눠서 실행. 예:1000개의 이미지를 100개씩 업로드.
 * 4. batch pqueue 외부 모듈 사용함
 * 5. 동시에 promise 10 개 실행
 */
const batchForUpdate = async () => {
  logger.info("start update");
  const numsOfRows = 50;
  const iteration = await calculator(numsOfRows);

  const queue = new PQueue({ concurrency: 10 });

  const result = await bulkAdd(1, numsOfRows);
  const value = {
    affectedRowsUpdate: 0,
    affectedRowsInput: result,
  };
  await loggingTask(value);

  for (let i = 0; i <= iteration; i++) {
    await queue.add(() => bulkUpdate(i + 1, numsOfRows));
  }
};

const batchForInput = async () => {
  logger.info("start input");
  const numsOfRows = 50;

  const iteration = await calculator(numsOfRows);
  const queue = new PQueue({ concurrency: 10 });

  for (let i = 0; i <= iteration; i++) {
    await queue.add(() => bulkInsert(i + 1, numsOfRows));
  }
};

/**
 * 목적: bulk insert 를 할지 아니면 bulk update 를 할지 결정한다.
 */

const selectorOfInputOrUpdate = async () => {
  const choose = await selectInputOrUpdate();

  return choose === 0 ? await batchForInput() : await batchForUpdate();
};

/**
 * 목적: 스케쥴러로써 유휴시간대에 업데이트를 한다. 시간은 30분 정도 걸린다.
 */

const taskManager = () => {
  logger.info("taskManager activated");
  cron.schedule("20 12 * * *", async () => {
    await selectorOfInputOrUpdate();
    const result = await crisInfoDao.getMetaData();
    logger.info(
      `affectedRowsInput: ${result[0].affectedRowsInput}, affectedRowsUpdate: ${result[0].affectedRowsUpdate}`
    );
    await crisInfoDao.isUpdateDao();
    await crisInfoDao.isNewDao();
    logger.info("update or input done");
  });

  //isNew 는 임상 논문 등재일로부터 한달이내인 경우 true, 나머지 경우는 false 로 한다.
  //new Date() - date_regi 를 사용한다. 스케쥴러는 cron 으로 작성하고 mysql 의 쿼리문을 작성한다.
};

const getList = async (pageNum: number) => {
  await schemaGetList.validateAsync({ pageNum });
  const result = await crisInfoDao.getListDao(pageNum);
  return result;
};

const getListView = async (trialId: string) => {
  await schemaGetListView.validateAsync({ trialId });
  const result = await crisInfoDao.getListViewDao(trialId);
  return result;
};

const getDetail = async (trialId: string) => {
  await schemaGetListView.validateAsync({ trialId });
  const result = await getCrisDetailFromOpenAPI(trialId);
  return result;
};

const getListBySearch = async (pageNum: number, searchText: string) => {
  await schemaGetListBySearch.validateAsync({ pageNum, searchText });
  const value = searchText
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.trim())
    .join("%");

  const result = await crisInfoDao.getListBySerachDao(pageNum, value);
  return result;
};

export default {
  crisInfoInputService,
  getCrisInfoFromOpenAPI,
  selectInputOrUpdate,
  checkTotalCountOfCris,
  getData,
  batchForInput,
  bulkInsert,
  selectorOfInputOrUpdate,
  bulkUpdate,
  taskManager,
  loggingTask,
  difference,
  getList,
  getListView,
  getDetail,
  getListBySearch,
  updateOneByOne,
};
