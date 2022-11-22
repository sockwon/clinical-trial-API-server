import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";
import CrisInfo from "./Crisinfo";

@Entity()
export class RawData {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne((type) => CrisInfo, (crisInfo) => crisInfo.trial_id)
  trial_id!: string;

  @Column({ type: "json", nullable: false })
  data!: JSON;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export default RawData;
