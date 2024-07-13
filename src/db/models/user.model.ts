import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Organization } from "./organization.model";
import { CurrentOrg } from "./currentorg.model";
import { AppDataSource } from "../init";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: "user" })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  phoneCode: string;

  @Column()
  password: string;

  @Column({ enum: ["personal", "business"], default: "personal" })
  account_type: string;

  @ManyToOne(() => CurrentOrg)
  currentOrg: CurrentOrg;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: false })
  is_blocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Organization, (user) => user.users)
  organizations: Organization[];
}

export const userRepository = AppDataSource.getRepository(User);
export type UserType = InstanceType<typeof User>;
