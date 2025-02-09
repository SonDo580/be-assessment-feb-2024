import { Column, Entity, ManyToMany } from "typeorm";

import { User } from "./User";
import { Teacher } from "./Teacher";

@Entity({ name: "students" })
export class Student extends User {
  @Column({ default: false })
  suspended: boolean;

  @ManyToMany(() => Teacher, (teacher) => teacher.students, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE", // we won't update id anyway
  })
  teachers: Teacher[];
}
