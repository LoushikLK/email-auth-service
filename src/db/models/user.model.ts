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

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: "user" })
  name: string;

  @Column({ unique: true })
  email: string;

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
