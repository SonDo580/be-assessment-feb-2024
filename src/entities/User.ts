import { Column } from "typeorm";

import { BaseEntity } from "./BaseEntity";

export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;
}
