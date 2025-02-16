import { In, Not, Repository } from "typeorm";

import { NotFoundError } from "@/core/http-errors";
import { AppDataSource } from "@/database/data-source";
import { Student } from "@/entities/Student";
import { Teacher } from "@/entities/Teacher";
import { RegisterStudentsReqBody } from "@/schemas/requests/register-students.request";
import { TeacherService } from "@/services/teacher.service";
import { CommonStudentsReqQuery } from "@/schemas/requests/common-students.request";
import { SuspendStudentReqBody } from "@/schemas/requests/suspend-student.request";
import { NotificationReceiverReqBody } from "@/schemas/requests/notification-receivers.request";

jest.mock("@/database/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("Teacher Service", () => {
  let teacherRepo: Partial<Repository<Teacher>>;
  let studentRepo: Partial<Repository<Student>>;

  beforeEach(() => {
    teacherRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    studentRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockImplementation(
      (entityClass) => {
        if (entityClass === Teacher) return teacherRepo;
        if (entityClass === Student) return studentRepo;
      }
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("TeacherService.registerStudents", () => {
    it("throw NotFoundError if teacher does not exists", async () => {
      const dto: RegisterStudentsReqBody = {
        teacher: "teacher@example.com",
        students: ["student@example.com"],
      };

      (teacherRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(TeacherService.registerStudents(dto)).rejects.toThrow(
        NotFoundError
      );

      expect(teacherRepo.findOne).toHaveBeenCalledWith({
        where: { email: dto.teacher },
        relations: { students: true },
      });
    });

    it("throw NotFoundError if any student does not exist", async () => {
      const teacherEmail = "teacher@example.com";
      const dto: RegisterStudentsReqBody = {
        teacher: teacherEmail,
        students: ["student@example.com"],
      };

      (teacherRepo.findOne as jest.Mock).mockResolvedValue({
        email: teacherEmail,
        students: [],
      });

      (studentRepo.find as jest.Mock).mockResolvedValue([]);

      await expect(TeacherService.registerStudents(dto)).rejects.toThrow(
        NotFoundError
      );

      expect(studentRepo.find).toHaveBeenCalledWith({
        where: { email: In(dto.students) },
      });
    });

    it("don't save if there aren't any new students", async () => {
      const teacherEmail = "teacher@example.com";
      const registeredStudentEmails = [
        "student1@example.com",
        "student2@example.com",
      ];
      const dto: RegisterStudentsReqBody = {
        teacher: teacherEmail,
        students: [registeredStudentEmails[0]],
      };

      (teacherRepo.findOne as jest.Mock).mockResolvedValue({
        email: teacherEmail,
        students: registeredStudentEmails.map((email) => ({ email })),
      });

      (studentRepo.find as jest.Mock).mockResolvedValue(
        dto.students.map((email) => ({ email }))
      );

      await TeacherService.registerStudents(dto);

      expect(teacherRepo.save).not.toHaveBeenCalled();
    });

    it("save the new students correctly", async () => {
      const teacherEmail = "teacher@example.com";
      const registeredStudentEmails = [
        "student1@example.com",
        "student2@example.com",
      ];
      const newStudentEmail = "student3@example.com";
      const dto: RegisterStudentsReqBody = {
        teacher: teacherEmail,
        students: [registeredStudentEmails[0], newStudentEmail],
      };

      (teacherRepo.findOne as jest.Mock).mockResolvedValue({
        email: teacherEmail,
        students: registeredStudentEmails.map((email) => ({ email })),
      });

      (studentRepo.find as jest.Mock).mockResolvedValue(
        dto.students.map((email) => ({ email }))
      );

      await TeacherService.registerStudents(dto);

      expect(teacherRepo.save).toHaveBeenCalledWith({
        email: teacherEmail,
        students: [...registeredStudentEmails, newStudentEmail].map(
          (email) => ({ email })
        ),
      });
    });
  });

  describe("TeacherService.getCommonStudents", () => {
    it("throw NotFoundError if any teachers does not exist", async () => {
      const teacherEmails = ["teacher1@example.com", "teacher2@example.com"];
      const dto: CommonStudentsReqQuery = {
        teacher: teacherEmails,
      };

      (teacherRepo.find as jest.Mock).mockResolvedValue([{ id: 1 }]);

      await expect(TeacherService.getCommonStudents(dto)).rejects.toThrow(
        NotFoundError
      );

      expect(teacherRepo.find).toHaveBeenCalledWith({
        where: { email: In(teacherEmails) },
        select: { id: true },
      });
    });

    it("return an empty list if no common students found", async () => {
      const teacherEmails = ["teacher1@example.com", "teacher2@example.com"];
      const dto: CommonStudentsReqQuery = {
        teacher: teacherEmails,
      };

      (teacherRepo.find as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);

      (studentRepo.createQueryBuilder as jest.Mock).mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        having: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      });

      const result = await TeacherService.getCommonStudents(dto);
      expect(result).toStrictEqual({ students: [] });
    });

    it("return the list of common students correctly", async () => {
      const teacherEmails = ["teacher1@example.com", "teacher2@example.com"];
      const commonStudents = [
        { email: "student1@example.com" },
        { email: "student2@example.com" },
      ];
      const dto: CommonStudentsReqQuery = {
        teacher: teacherEmails,
      };

      (teacherRepo.find as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);

      (studentRepo.createQueryBuilder as jest.Mock).mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        having: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(commonStudents),
      });

      const result = await TeacherService.getCommonStudents(dto);
      expect(result).toStrictEqual({
        students: commonStudents.map(({ email }) => email),
      });
    });
  });

  describe("TeacherService.suspendStudent", () => {
    it("throw NotFoundError if student does not exist", async () => {
      const studentEmail = "empty@example.com";
      const dto: SuspendStudentReqBody = {
        student: studentEmail,
      };

      (studentRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(TeacherService.suspendStudent(dto)).rejects.toThrow(
        NotFoundError
      );

      expect(studentRepo.findOne).toHaveBeenCalledWith({
        where: { email: studentEmail },
      });
    });

    it("don't save if a student has already been suspended", async () => {
      const studentEmail = "exist@example.com";
      const student = { id: 1, email: studentEmail, suspended: true };
      const dto: SuspendStudentReqBody = {
        student: studentEmail,
      };

      (studentRepo.findOne as jest.Mock).mockResolvedValue(student);

      await TeacherService.suspendStudent(dto);

      expect(studentRepo.save).not.toHaveBeenCalled();
    });

    it("suspend a student if they exist and have not been suspended", async () => {
      const studentEmail = "exist@example.com";
      const student = { id: 1, email: studentEmail, suspended: false };
      const dto: SuspendStudentReqBody = {
        student: studentEmail,
      };

      (studentRepo.findOne as jest.Mock).mockResolvedValue(student);

      await TeacherService.suspendStudent(dto);

      expect(studentRepo.save).toHaveBeenCalledWith({
        ...student,
        suspended: true,
      });
    });
  });

  describe("TeacherService.getNotificationReceivers", () => {
    it("throw NotFoundError if teacher does not exist", async () => {
      const teacherEmail = "empty@example.com";
      const dto: NotificationReceiverReqBody = {
        teacher: teacherEmail,
        notification: "",
      };

      (teacherRepo.createQueryBuilder as jest.Mock).mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(
        TeacherService.getNotificationReceivers(dto)
      ).rejects.toThrow(NotFoundError);
    });

    it("return not-suspended registered and mentioned students", async () => {
      const teacherEmail = "teacher@example.com";
      const registeredStudents = [
        { id: 1, email: "student1@example.com", suspended: false },
        { id: 2, email: "student2@example.com", suspended: true }, // suspended
      ];
      const mentionedStudents = [
        { id: 3, email: "student3@example.com", suspended: false },
        { id: 4, email: "student4@example.com", suspended: true }, // suspended
      ];
      const teacher = {
        id: 1,
        email: teacherEmail,
        students: registeredStudents,
      };
      const dto: NotificationReceiverReqBody = {
        teacher: teacherEmail,
        notification: `Hello ${mentionedStudents
          .map(({ email }) => `@${email}`)
          .join(" ")}`,
      };

      (teacherRepo.createQueryBuilder as jest.Mock).mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          ...teacher,
          students: registeredStudents.filter(({ suspended }) => !suspended),
        }),
      });

      (studentRepo.find as jest.Mock).mockResolvedValue(
        mentionedStudents.filter(({ suspended }) => !suspended)
      );

      const result = await TeacherService.getNotificationReceivers(dto);

      expect(result).toStrictEqual({
        recipients: ["student1@example.com", "student3@example.com"],
      });
    });
  });
});
