import database from "./database";
import CrisInfo from "../entity/Crisinfo";
import ICrisInputData from "../interfaces/Icrisinfo";

const crisInfoInputDao = async (inputData: ICrisInputData[]) => {
  return await database
    .createQueryBuilder()
    .insert()
    .into(CrisInfo)
    .values(inputData)
    .orIgnore()
    .execute();
};
// const isEndDao = async () => {
//   await database.query(
//     `
//     UPDATE cris_info
//     SET cris_info.isEnd = true,
//     cris_info.isUpdate = false
//     WHERE cris_info.results_date_completed IS NOT NULL
//     AND cris_info.results_date_completed <= DATE(CURRENT_TIMESTAMP)
//     `
//   );
// };

const isEmptyDao = async (table: string) => {
  return await database.query(
    `
    SELECT COUNT(*) FROM ${table}
    `
  );
};

const crisInfoAddDao = async (inputData: ICrisInputData[]) => {
  const result = await database
    .createQueryBuilder()
    .insert()
    .into(CrisInfo)
    .values(inputData)
    .orIgnore()
    .execute();
  return result;
};

const crisInfoUpdateDao = async (inputData: ICrisInputData) => {
  const result = await database
    .createQueryBuilder()
    .update(CrisInfo)
    .set(inputData)
    .where("trial_id =:trial_id", { trial_id: inputData.trial_id })
    .andWhere("date_updated !=:date_updated", {
      date_updated: inputData.date_updated,
    })
    .execute();
  return result;
};

export default {
  crisInfoInputDao,
  isEmptyDao,
  crisInfoAddDao,
  crisInfoUpdateDao,
};
