import database from "./database";
import CrisInfo from "../entity/Crisinfo";
import ICrisInputData from "../interfaces/Icrisinfo";
import IMetaData from "../interfaces/IMetaData";
import MetaData from "../entity/MetaData";

const crisInfoInputDao = async (inputData: ICrisInputData[]) => {
  return await database
    .createQueryBuilder()
    .insert()
    .into(CrisInfo)
    .values(inputData)
    .orIgnore()
    .updateEntity(false)
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

const mataDataDao = async (data: IMetaData) => {
  return await database.query(
    `
    INSERT 
    INTO meta_data (meta_id, affectedRowsInput, affectedRowsUpdate) 
    VALUES (${data.meta_id},${data.affectedRowsInput},${data.affectedRowsUpdate}) 
    ON DUPLICATE KEY UPDATE 
    affectedRowsInput=affectedRowsInput+${data.affectedRowsInput},
    affectedRowsUpdate=affectedRowsUpdate+${data.affectedRowsUpdate}
    `
  );
};
const getMetaData = async () => {
  return await database.query(
    `
    SELECT * FROM meta_data ORDER BY id DESC LIMIT 1;
    `
  );
};

const isUpdateDao = async () => {
  const thirtyDays = 1000 * 60 * 60 * 24 * 7;
  const date: Date = new Date();
  const temp = date.getTime() - thirtyDays;
  const a = new Date(temp);
  const b = `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
  await database.query(
    `
    UPDATE cris_info SET isUpdate=false
    `
  );
  return await database.query(
    `
    UPDATE cris_info SET isUpdate=true WHERE date_updated>'${b}'
    `
  );
};

//TODO: isNew 를  true 또는 false 로 표시한다. 한달 이내 등재됐다면 true, 아니라면 false.
const isNewDao = async () => {
  const thirtyDays = 1000 * 60 * 60 * 24 * 30;
  const date: Date = new Date();
  const temp = date.getTime() - thirtyDays;
  const a = new Date(temp);
  const b = `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
  await database.query(
    `
  UPDATE cris_info SET isNew=false
  `
  );

  await database.query(
    `
    UPDATE cris_info SET isNew=true WHERE date_registration>'${b}'
    `
  );
};

/**
 * list get
 * 1.isNew, isUpdate 를 가장 먼저 보여준다.
 * 2.페이지 네이션 구현(offset, limit)
 * 3.
 */
const getListDao = async (pageNum: number) => {
  const howManySkip = pageNum * 10;
  return await database
    .getRepository(CrisInfo)
    .createQueryBuilder("crisInfo")
    .select("crisInfo.date_registration")
    .addSelect("crisInfo.date_updated")
    .addSelect("crisInfo.isNew")
    .addSelect("crisInfo.isUpdate")
    .addSelect("crisInfo.scientific_title_kr")
    .addSelect("crisInfo.trial_id")
    .skip(howManySkip)
    .take(10)
    .orderBy("crisInfo.isUpdate", "DESC")
    .getMany();
};

/**
 * list 정보를 자세히 보여준다
 * 1.trial_id 로 검색한다.
 */

const getListViewDao = async (trialId: string) => {
  return await database
    .getRepository(CrisInfo)
    .createQueryBuilder("crisInfo")
    .where("trial_id =:trial_id", { trial_id: trialId })
    .getOne();
};

export default {
  crisInfoInputDao,
  isEmptyDao,
  crisInfoUpdateDao,
  mataDataDao,
  getMetaData,
  isUpdateDao,
  isNewDao,
  getListDao,
  getListViewDao,
};
