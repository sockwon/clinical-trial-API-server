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
  return await database
    .createQueryBuilder()
    .update(CrisInfo)
    .set(inputData)
    .where("trial_id =:trial_id", { trial_id: inputData.trial_id })
    .andWhere("isEnd =:isEnd", { isEnd: false })
    .andWhere("date_updated !=:date_updated", {
      date_updated: inputData.date_updated,
    })
    .execute();
};

const isUpdatedDao = async () => {
  return await database.query(
    `
    UPDATE cris_info 
    SET isUpdate = true
    WHERE date_format(updated_at, '%Y-%m-%d') = date_format(CURRENT_DATE, '%Y-%m-%d')
    `
  );
};
//date_format(datetime, '%Y-%m-%d')

export default {
  crisInfoInputDao,
  isEndDao,
  isEmptyDao,
  crisInfoAddDao,
  crisInfoUpdateDao,
  isUpdatedDao,
};
