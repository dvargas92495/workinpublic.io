import {MigrationInterface, QueryRunner} from "typeorm";

export class projectname1634935596573 implements MigrationInterface {
    name = 'projectname1634935596573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`projects\` ADD \`name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`name\``);
    }

}
