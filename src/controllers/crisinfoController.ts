import { Request, Response } from "express";
import crisinfoService from "../services/crisinfoService";

/**
 * 목적: 요청을 비즈니스 로직에 전달, 결과값을 응답으로 클라이언트에 전달.
 * result 는 input 에 따른 결과값으로 new -> rows , update -> rows
 */
const crisInfoInputControll = async (req: Request, res: Response) => {
  const result = await crisinfoService.batchForInput();
  console.log(result);
  res.status(201).json(result);
};

export default {
  crisInfoInputControll,
};
