import { Request, Response } from "express";
import { number, string } from "joi";
import crisInfoService from "../services/crisinfoService";

/**
 * 목적: 요청을 비즈니스 로직에 전달, 결과값을 응답으로 클라이언트에 전달.
 * result 는 input 에 따른 결과값으로 new -> rows , update -> rows
 */
const crisInfoInputControll = async (req: Request, res: Response) => {
  const result = await crisInfoService.selectorOfInputOrUpdate();
  res.status(201).json(result);
};

const getListControll = async (req: Request, res: Response) => {
  const { pageNum } = req.query;
  const result = await crisInfoService.getList(Number(pageNum));
  res.status(200).json(result);
};

const getListViewControll = async (req: Request, res: Response) => {
  const { trial_id } = req.query;
  const result = await crisInfoService.getListView(String(trial_id));
  res.status(200).json(result);
};

export default {
  crisInfoInputControll,
  getListControll,
  getListViewControll,
};
