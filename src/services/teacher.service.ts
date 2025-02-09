import { RegisterStudentsReqBody } from "@/schemas/requests/register-students.request";

export class TeacherService {
  /* Register students to a specified teacher */
  public static async registerStudents({
    teacher: teacherEmail,
    students: studentEmails,
  }: RegisterStudentsReqBody): Promise<void> {
    console.log({ teacherEmail, studentEmails });

  }
}
