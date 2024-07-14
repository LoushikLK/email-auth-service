import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.model";
import { AppDataSource } from "../init";

@Entity()
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: "organization" + new Date().getTime() })
  name: string;

  @Column({ unique: true })
  domain: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => User, (user) => user.organizations)
  users: User[];
}

export const organizationRepository = AppDataSource.getRepository(Organization);
export type OrganizationType = InstanceType<typeof Organization>;
