import { Repository } from "typeorm";

import { connectDB, disconnectDB } from "./connection";
import { AppDataSource } from "./data-source";
import { Student } from "@/entities/Student";
import { Teacher } from "@/entities/Teacher";

(async () => {
  try {
    await connectDB();

    const studentRepo: Repository<Student> =
      AppDataSource.getRepository(Student);
    const teacherRepo: Repository<Teacher> =
      AppDataSource.getRepository(Teacher);

    const students: Student[] = Array.from({ length: 20 }).map((_, index) =>
      studentRepo.create({ email: `student${index}@x.com` })
    );
    const teachers: Teacher[] = Array.from({ length: 5 }).map((_, index) =>
      teacherRepo.create({ email: `teacher${index}@x.com` })
    );

    await studentRepo.save(students);
    await teacherRepo.save(teachers);

    console.log("Database seeded successfully");
    await disconnectDB();
  } catch (error) {
    console.log("Error seeding database:", error);
    await disconnectDB();
    process.exit(1);
  }
})();
