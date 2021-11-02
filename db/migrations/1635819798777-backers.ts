import {MigrationInterface, QueryRunner} from "typeorm";

export class backers1635819798777 implements MigrationInterface {
    name = 'backers1635819798777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`project_backers\` (\`uuid\` char(36) NOT NULL, \`payment_intent\` varchar(63) NOT NULL, \`projectUuid\` char(36) NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD \`progress\` int UNSIGNED NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`project_backers\` ADD CONSTRAINT \`FK_90f5dc07f6d7aad24d927628e71\` FOREIGN KEY (\`projectUuid\`) REFERENCES \`projects\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_backers\` DROP FOREIGN KEY \`FK_90f5dc07f6d7aad24d927628e71\``);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`progress\``);
        await queryRunner.query(`DROP TABLE \`project_backers\``);
    }

}
