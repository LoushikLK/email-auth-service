import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.model";
import { Organization } from "./organization.model";

@Entity()
export class CurrentOrg {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.currentOrg)
  user: User;

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization: Organization;

  @Column({ enum: ["superadmin", "admin", "user"], default: "user" })
  role: string;

  @Column({ default: false })
  is_blocked: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
