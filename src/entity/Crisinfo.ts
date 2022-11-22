import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class CrisInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false, unique: true, length: 20 })
  trial_id!: string;

  @Column({ type: "varchar", nullable: false, length: 400 })
  scientific_title_kr!: string;

  @Column({ type: "varchar", nullable: false, length: 400 })
  scientific_title_en!: string;

  @Column({ type: "date", nullable: false })
  date_registration!: Date;

  @Column({ type: "date", nullable: true })
  date_updated!: Date;

  @Column({ type: "varchar", nullable: false, length: 30 })
  type_enrolment_kr!: string;

  @Column({ type: "date", nullable: false })
  date_enrolment!: Date;

  @Column({ type: "date", nullable: false })
  results_date_completed!: Date;

  @Column({ type: "varchar", nullable: false, length: 30 })
  results_type_date_completed_kr!: string;

  @Column({ type: "varchar", nullable: false, length: 40 })
  study_type_kr!: string;

  @Column({ type: "varchar", nullable: false, length: 400 })
  i_freetext_kr!: string;

  @Column({ type: "varchar", nullable: false, length: 100 })
  phase_kr!: string;

  @Column({ type: "varchar", nullable: false, length: 200 })
  source_name_kr!: string;

  @Column({ type: "varchar", nullable: false, length: 200 })
  primary_sponsor_kr!: string;

  @Column({ type: "varchar", nullable: false, length: 4000 })
  primary_outcome_1_kr!: string;

  @Column({ type: "boolean", nullable: false, default: true })
  isNew!: boolean;

  @Column({ type: "boolean", nullable: false, default: false })
  isUpdate!: boolean;

  @Column({ type: "boolean", nullable: true })
  isEnd!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @Column({
    type: "timestamp",
    default: () => null,
    nullable: true,
    onUpdate: "NOW()",
  })
  updated_at!: Date;
}

export default CrisInfo;
/*
primary_outcome_1_kr: Joi.string().max(200),
*/
