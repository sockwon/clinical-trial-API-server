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
    SET cris_info.isEnd = true
    WHERE cris_info.results_date_completed IS NOT NULL
    AND cris_info.results_date_completed <= DATE(CURRENT_TIMESTAMP)
    `
  );
};

const isEmpty = async (table: string) => {
  return await database.query(
    `
    SELECT COUNT(*) FROM ${table}
    `
  );
};

export default {
  crisInfoInputDao,
  isEndDao,
  isEmpty,
};
