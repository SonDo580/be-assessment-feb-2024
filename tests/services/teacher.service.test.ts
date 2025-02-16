import { In, Repository } from "typeorm";

import { NotFoundError } from "@/core/http-errors";
import { AppDataSource } from "@/database/data-source";
import { Student } from "@/entities/Student";
import { Teacher } from "@/entities/Teacher";
import { RegisterStudentsReqBody } from "@/schemas/requests/register-students.request";
import { TeacherService } from "@/services/teacher.service";
import { CommonStudentsReqQuery } from "@/schemas/requests/common-students.request";

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
});
