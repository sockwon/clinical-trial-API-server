import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
class MetaData {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", nullable: true, default: null })
  totalCount!: number;

  @Column({ type: "int", nullable: true, default: null })
  affectedRowsInput!: number;

  @Column({ type: "int", nullable: true, default: null })
  affectedRowsUpdate!: number;

  @Column({ type: "varchar", unique: true, nullable: true, default: null })
  meta_id!: string;

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

export default MetaData;
