import { In } from "typeorm";

import { ErrorMessage } from "@/constants/message.const";
import { NotFoundError } from "@/core/http-errors";
import { AppDataSource } from "@/database/data-source";
import { Student } from "@/entities/Student";
import { Teacher } from "@/entities/Teacher";
import { RegisterStudentsReqBody } from "@/schemas/requests/register-students.request";

export class TeacherService {
  /* Register students to a specified teacher */
  public static async registerStudents({
    teacher: teacherEmail,
    students: studentEmails,
  }: RegisterStudentsReqBody): Promise<void> {
    const teacherRepo = AppDataSource.getRepository(Teacher);
    const studentRepo = AppDataSource.getRepository(Student);

    // Find the teacher and associated students
    const teacher = await teacherRepo.findOne({
      where: { email: teacherEmail },
      relations: ["students"],
    });

    // Check if the teacher exists
    if (!teacher) {
      throw new NotFoundError(ErrorMessage.TEACHER_NOT_FOUND);
    }

    // Find the students to be registered
    const students = await studentRepo.find({
      where: { email: In(studentEmails) },
    });

    // Check if all exists
    if (students.length < studentEmails.length) {
      throw new NotFoundError(ErrorMessage.STUDENT_NOT_FOUND);
    }

    // Extract only new students
    const registeredStudentEmailSet = new Set(
      teacher.students.map((s) => s.email)
    );
    const newStudents = students.filter(
      (s) => !registeredStudentEmailSet.has(s.email)
    );

    // Register the new students
    if (newStudents.length > 0) {
      teacher.students.push(...newStudents);
      await teacherRepo.save(teacher);
    }
  }
}
