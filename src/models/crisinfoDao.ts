import database from "./database";
import CrisInfo from "../entity/Crisinfo";
import ICrisInputData from "../interfaces/Icrisinfo";

const crisInfoInputDao = async (inputData: ICrisInputData[]) => {
  return await database
    .createQueryBuilder()
    .insert()
    .into(CrisInfo)
    .values(inputData)
    .execute();
};

const isEndDao = async () => {
  await database.query(
    `
    UPDATE cris_info 
    SET cris_info.isEnd = true,
    cris_info.isUpdate = false
    WHERE cris_info.results_date_completed IS NOT NULL
    AND cris_info.results_date_completed <= DATE(CURRENT_TIMESTAMP)
    `
  );
};

const isEmptyDao = async (table: string) => {
  return await database.query(
    `
    SELECT COUNT(*) FROM ${table}
    `
  );
};

const crisInfoAddDao = async (inputData: ICrisInputData[]) => {
  return await database
    .createQueryBuilder()
    .insert()
    .into(CrisInfo)
    .values(inputData)
    .orIgnore()
    .execute();
};

const crisInfoUpdateDao = async (inputData: ICrisInputData) => {
  return await database.query(
    `
    UPDATE cris_info
    SET scientific_title_kr = CASE WHEN cris_info.scientific_title_kr != ${inputData["scientific_title_kr"]} THEN ${inputData["scientific_title_kr"]} END,
    scientific_title_en = CASE WHEN cris_info.scientific_title_en != ${inputData["scientific_title_en"]} THEN ${inputData["scientific_title_en"]} END,
    date_registration = CASE WHEN cris_info.date_registration != ${inputData["date_registration"]} THEN ${inputData["date_registration"]} END,
    date_updated = CASE WHEN cris_info.date_updated != ${inputData["date_updated"]} THEN ${inputData["date_updated"]} END,
    date_enrolment = CASE WHEN cris_info.date_enrolment != ${inputData["date_enrolment"]} THEN ${inputData["date_enrolment"]} END,
    type_enrolment_kr = CASE WHEN cris_info.type_enrolment_kr != ${inputData["type_enrolment_kr"]} THEN ${inputData["type_enrolment_kr"]} END,
    results_date_completed = CASE WHEN cris_info.results_date_completed != ${inputData["results_date_completed"]} THEN ${inputData["results_date_completed"]} END,
    results_type_date_completed_kr = CASE WHEN cris_info.results_type_date_completed_kr != ${inputData["results_type_date_completed_kr"]} THEN ${inputData["results_type_date_completed_kr"]} END,
    study_type_kr = CASE WHEN cris_info.study_type_kr != ${inputData["study_type_kr"]} THEN ${inputData["study_type_kr"]} END,
    i_freetext_kr = CASE WHEN cris_info.i_freetext_kr != ${inputData["i_freetext_kr"]} THEN ${inputData["i_freetext_kr"]} END,
    phase_kr = CASE WHEN cris_info.phase_kr != ${inputData["phase_kr"]} THEN ${inputData["phase_kr"]} END,
    source_name_kr = CASE WHEN cris_info.source_name_kr != ${inputData["source_name_kr"]} THEN ${inputData["source_name_kr"]} END,
    primary_sponsor_kr = CASE WHEN cris_info.primary_sponsor_kr != ${inputData["primary_sponsor_kr"]} THEN ${inputData["primary_sponsor_kr"]} END,
    primary_outcome_1_kr = CASE WHEN cris_info.primary_outcome_1_kr != ${inputData["primary_outcome_1_kr"]} THEN ${inputData["primary_outcome_1_kr"]} END,
    WHERE cris_info.trial_id = ${inputData["trial_id"]} AND cris_info.isEnd != true
    `
  );
};

const isUpdatedDao = async () => {
  return await database.query(
    `
    UPDATE cris_info 
    SET isUpdate = true
    WHEN DATE(cris_info.updated_at) = DATE(CURRENT_TIMESTAMP)
    AND cris_info.isEnd != true
    `
  );
};

export default {
  crisInfoInputDao,
  isEndDao,
  isEmptyDao,
  crisInfoAddDao,
  crisInfoUpdateDao,
  isUpdatedDao,
};
