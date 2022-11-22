import crisInfoDao from "../models/crisinfoDao";
import ICrisInputData from "../interfaces/Icrisinfo";
import Joi from "joi";

const schemaCrisInfoInputData = Joi.object({
  trial_id: Joi.string().pattern(new RegExp("^[A-z]{3,3}d{7,7}$")).required(),
  scientific_title_kr: Joi.string().required().max(400),
  study_type_kr: Joi.string().required().max(40),
  date_registration: Joi.date().required(),
  date_updated: Joi.date(),
  primary_sponsor_kr: Joi.string().max(200),
  scientific_title_en: Joi.string().required().max(400),
  date_enrolment: Joi.date(),
  type_enrolment_kr: Joi.string().max(30),
  results_date_completed: Joi.date(),
  results_type_date_completed_kr: Joi.string().max(30),
  i_freetext_kr: Joi.string().max(400),
  phase_kr: Joi.string().max(100),
  source_name_kr: Joi.string().max(200),
  primary_outcome_1_kr: Joi.string().max(200),
});

const schemaInputArray = Joi.array().items(schemaCrisInfoInputData);

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

export default {
  crisInfoInputService,
};
