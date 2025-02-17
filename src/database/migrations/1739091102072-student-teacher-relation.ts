import { MigrationInterface, QueryRunner } from "typeorm";

export class StudentTeacherRelation1739091102072 implements MigrationInterface {
    name = 'StudentTeacherRelation1739091102072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`teachers_students\` (\`teacher_id\` int NOT NULL, \`student_id\` int NOT NULL, INDEX \`IDX_1f52f3b1dd18053818abbfa038\` (\`teacher_id\`), INDEX \`IDX_412e0c9c281e8e6955e123364e\` (\`student_id\`), PRIMARY KEY (\`teacher_id\`, \`student_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`teachers_students\` ADD CONSTRAINT \`FK_1f52f3b1dd18053818abbfa0388\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`teachers_students\` ADD CONSTRAINT \`FK_412e0c9c281e8e6955e123364e2\` FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teachers_students\` DROP FOREIGN KEY \`FK_412e0c9c281e8e6955e123364e2\``);
        await queryRunner.query(`ALTER TABLE \`teachers_students\` DROP FOREIGN KEY \`FK_1f52f3b1dd18053818abbfa0388\``);
        await queryRunner.query(`DROP INDEX \`IDX_412e0c9c281e8e6955e123364e\` ON \`teachers_students\``);
        await queryRunner.query(`DROP INDEX \`IDX_1f52f3b1dd18053818abbfa038\` ON \`teachers_students\``);
        await queryRunner.query(`DROP TABLE \`teachers_students\``);
    }

}
