import { Entity } from "typeorm";

import { User } from "./User";

@Entity({ name: "teachers" })
export class Teacher extends User {}
