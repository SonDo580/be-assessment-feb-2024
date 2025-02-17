import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSuspendedFieldForStudent1739094943593 implements MigrationInterface {
    name = 'AddSuspendedFieldForStudent1739094943593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`students\` ADD \`suspended\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`students\` DROP COLUMN \`suspended\``);
    }

}
