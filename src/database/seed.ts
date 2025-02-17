import { AppDataSource } from "./data-source";
import { Student } from "@/entities/Student";
import { Teacher } from "@/entities/Teacher";

(async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    const studentRepo = AppDataSource.getRepository(Student);
    const teacherRepo = AppDataSource.getRepository(Teacher);

    const students = Array.from({ length: 20 }).map((_, index) =>
      studentRepo.create({ email: `student${index}@x.com` })
    );
    const teachers = Array.from({ length: 5 }).map((_, index) =>
      studentRepo.create({ email: `teacher${index}@x.com` })
    );

    await studentRepo.save(students);
    await teacherRepo.save(teachers);

    console.log("Database seeded successfully");

    await AppDataSource.destroy();
    console.log("Database connection closed");
  } catch (error) {
    console.log("Error seeding database:", error);
    process.exit(1);
  }
})();
