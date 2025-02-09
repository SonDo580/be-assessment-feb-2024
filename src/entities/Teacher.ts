import { Entity, JoinTable, ManyToMany } from "typeorm";

import { User } from "./User";
import { Student } from "./Student";

@Entity({ name: "teachers" })
export class Teacher extends User {
  @ManyToMany(() => Student, (student) => student.teachers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE" // we won't update id anyway
  })
  @JoinTable({
    name: "teachers_students",
    joinColumn: { name: "teacher_id" },
    inverseJoinColumn: { name: "student_id" },
  })
  students: Student[];
}
