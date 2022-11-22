import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class CrisInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  // @OneToOne((type) => User, (user) => user.id)
  // user!: number;

  @Column({ type: "varchar", nullable: false, unique: true })
  trial_id!: string;

  @Column({ type: "varchar", nullable: false })
  scientific_title_kr!: string;

  @Column({ type: "varchar", nullable: false })
  scientific_title_en!: string;

  @Column({ type: "date", nullable: false })
  date_registration!: Date;

  @Column({ type: "date", nullable: true })
  date_updated!: Date;

  @Column({ type: "varchar", nullable: false })
  primary_sponsor_kr!: string;

  @Column({ type: "boolean", nullable: false, default: true })
  isNew!: boolean;

  @Column({ type: "boolean", nullable: false, default: false })
  isUpdate!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export default CrisInfo;
