import { Entity } from "typeorm";

import { User } from "./User";

@Entity({ name: "students" })
export class Student extends User {}
