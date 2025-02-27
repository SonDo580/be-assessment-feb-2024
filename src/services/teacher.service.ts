import { In, Not, Repository } from "typeorm";
import { z } from "zod";

import { ErrorMessage } from "@/constants/message.const";
import { NotFoundError } from "@/core/http-errors";
import { AppDataSource } from "@/database/data-source";
import { Student } from "@/entities/Student";
import { Teacher } from "@/entities/Teacher";
import { RegisterStudentsReqBody } from "@/schemas/requests/register-students.request";
import { SuspendStudentReqBody } from "@/schemas/requests/suspend-student.request";
import { CommonStudentsReqQuery } from "@/schemas/requests/common-students.request";
import { CommonStudentsResBody } from "@/schemas/responses/common-students.response";
import { NotificationReceiverReqBody } from "@/schemas/requests/notification-receivers.request";
import { NotificationReceiversResBody } from "@/schemas/responses/notification-receivers.response";
import { StringUtil } from "@/utils/string.util";

export class TeacherService {
  /* Register students to a specified teacher */
  public static async registerStudents({
    teacher: teacherEmail,
    students: studentEmails,
  }: RegisterStudentsReqBody): Promise<void> {
    const teacherRepo: Repository<Teacher> =
      AppDataSource.getRepository(Teacher);
    const studentRepo: Repository<Student> =
      AppDataSource.getRepository(Student);

    // Find the teacher and associated students
    const teacher: Teacher | null = await teacherRepo.findOne({
      where: { email: teacherEmail },
      relations: { students: true },
    });

    // Check if the teacher exists
    if (!teacher) {
      throw new NotFoundError(ErrorMessage.TEACHER_NOT_FOUND);
    }

    // Find the students to be registered
    const students: Student[] = await studentRepo.find({
      where: { email: In(studentEmails) },
    });

    // Check if all students exists
    if (students.length < studentEmails.length) {
      throw new NotFoundError(ErrorMessage.STUDENT_NOT_FOUND);
    }

    // Extract only new students
    const registeredStudentEmailSet: Set<string> = new Set(
      teacher.students.map((s) => s.email)
    );
    const newStudents: Student[] = students.filter(
      (s) => !registeredStudentEmailSet.has(s.email)
    );

    // Register the new students
    if (newStudents.length > 0) {
      teacher.students.push(...newStudents);
      await teacherRepo.save(teacher);
    }
  }

  /* Find common students under a list of teachers */
  public static async getCommonStudents({
    teacher: teacherEmails,
  }: CommonStudentsReqQuery): Promise<CommonStudentsResBody> {
    const teacherRepo: Repository<Teacher> =
      AppDataSource.getRepository(Teacher);
    const studentRepo: Repository<Student> =
      AppDataSource.getRepository(Student);

    // Find the teachers
    const teachers: Teacher[] = await teacherRepo.find({
      where: { email: In(teacherEmails) },
      select: { id: true }, // Only select id to reduce size
    });

    // Check if all teachers exists
    if (teachers.length < teacherEmails.length) {
      throw new NotFoundError(ErrorMessage.TEACHER_NOT_FOUND);
    }

    // Find the common students
    // Note: if pass only 1 teacher, retrieve the list of students for that teacher
    const commonStudents: Pick<Student, "email">[] = await studentRepo
      .createQueryBuilder("s")
      .innerJoin("s.teachers", "t")
      .select("s.email", "email")
      .where("t.email IN (:...teacherEmails)", { teacherEmails })
      .groupBy("s.id")
      .having("COUNT(t.id) = :teacherCount", {
        teacherCount: teacherEmails.length,
      })
      .getRawMany();

    return {
      students: commonStudents.map(({ email }) => email),
    };
  }

  /* Suspend a student */
  public static async suspendStudent({
    student: studentEmail,
  }: SuspendStudentReqBody): Promise<void> {
    const studentRepo: Repository<Student> =
      AppDataSource.getRepository(Student);

    // Find the student
    const student: Student | null = await studentRepo.findOne({
      where: { email: studentEmail },
    });

    // Check if the student exists
    if (!student) {
      throw new NotFoundError(ErrorMessage.STUDENT_NOT_FOUND);
    }

    if (!student.suspended) {
      // Suspend the student
      student.suspended = true;
      await studentRepo.save(student);
    }
  }

  /* Find common students under a list of teachers */
  public static async getNotificationReceivers({
    teacher: teacherEmail,
    notification,
  }: NotificationReceiverReqBody): Promise<NotificationReceiversResBody> {
    const teacherRepo: Repository<Teacher> =
      AppDataSource.getRepository(Teacher);
    const studentRepo: Repository<Student> =
      AppDataSource.getRepository(Student);

    // Find the teacher and his/her not-suspended students
    const teacher: Teacher | null = await teacherRepo
      .createQueryBuilder("t")
      .leftJoinAndSelect("t.students", "s", "s.suspended = false")
      .where("t.email = :email", { email: teacherEmail })
      .getOne();

    // Check if the teacher exists
    if (!teacher) {
      throw new NotFoundError(ErrorMessage.TEACHER_NOT_FOUND);
    }

    // Extract emails and ids of registered students
    const {
      registeredStudentEmails,
      registeredStudentIds,
    }: {
      registeredStudentEmails: string[];
      registeredStudentIds: number[];
    } = teacher.students.reduce(
      (acc, s) => {
        acc.registeredStudentEmails.push(s.email);
        acc.registeredStudentIds.push(s.id);
        return acc;
      },
      {
        registeredStudentEmails: [] as string[],
        registeredStudentIds: [] as number[],
      }
    );

    // Extract the emails mentioned in notification
    const possibleEmails: string[] =
      StringUtil.extractEmailsFromNotification(notification);

    // Find the not-suspended students mentioned in the notification
    // that are not registered under the teacher
    const extraStudents: Student[] = await studentRepo.find({
      where: {
        suspended: false,
        email: In(possibleEmails),
        id: Not(In(registeredStudentIds)),
      },
      select: { id: true, email: true },
    });

    return {
      recipients: [
        ...registeredStudentEmails,
        ...extraStudents.map(({ email }) => email),
      ],
    };
  }
}
