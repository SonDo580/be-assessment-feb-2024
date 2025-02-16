import { In, Not } from "typeorm";
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
      relations: { students: true },
    });

    // Check if the teacher exists
    if (!teacher) {
      throw new NotFoundError(ErrorMessage.TEACHER_NOT_FOUND);
    }

    // Find the students to be registered
    const students = await studentRepo.find({
      where: { email: In(studentEmails) },
    });

    // Check if all students exists
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

  /* Find common students under a list of teachers */
  public static async getCommonStudents({
    teacher: teacherEmails,
  }: CommonStudentsReqQuery): Promise<CommonStudentsResBody> {
    const teacherRepo = AppDataSource.getRepository(Teacher);
    const studentRepo = AppDataSource.getRepository(Student);

    // Find the teachers
    const teachers = await teacherRepo.find({
      where: { email: In(teacherEmails) },
      select: { id: true }, // Only select id to reduce size
    });

    // Check if all teachers exists
    if (teachers.length < teacherEmails.length) {
      throw new NotFoundError(ErrorMessage.TEACHER_NOT_FOUND);
    }

    // Find the common students
    const commonStudents = await studentRepo
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
    const studentRepo = AppDataSource.getRepository(Student);

    // Find the student
    const student = await studentRepo.findOne({
      where: { email: studentEmail },
    });

    // Check if the student exists
    if (!student) {
      throw new NotFoundError(ErrorMessage.STUDENT_NOT_FOUND);
    }

    // Suspend the student
    student.suspended = true;
    await studentRepo.save(student);
  }

  /* Find common students under a list of teachers */
  public static async getNotificationReceivers({
    teacher: teacherEmail,
    notification,
  }: NotificationReceiverReqBody): Promise<NotificationReceiversResBody> {
    const teacherRepo = AppDataSource.getRepository(Teacher);
    const studentRepo = AppDataSource.getRepository(Student);

    // Find the teacher and his/her not-suspended students
    const teacher = await teacherRepo
      .createQueryBuilder("t")
      .leftJoinAndSelect("t.students", "s", "s.suspended = false")
      .where("t.email = :email", { email: teacherEmail })
      .getOne();

    // Check if the teacher exists
    if (!teacher) {
      throw new NotFoundError(ErrorMessage.TEACHER_NOT_FOUND);
    }

    // Extract emails and ids of registered students
    const { registeredStudentEmails, registeredStudentIds } =
      teacher.students.reduce(
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
    const possibleEmails =
      TeacherService.extractEmailsFromNotification(notification);

    // Find the not-suspended students mentioned in the notification
    // and that are not registered under the teacher
    const extraStudents = await studentRepo.find({
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

  /* Helper: extract emails from a notification */
  private static extractEmailsFromNotification(notification: string): string[] {
    const emailSchema = z.string().email();
    return notification
      .split(/\s+/)
      .filter((word) => word[0] === "@")
      .map((word) => word.slice(1))
      .filter((word) => emailSchema.safeParse(word).success);
  }
}
