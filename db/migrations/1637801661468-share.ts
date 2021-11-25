import {MigrationInterface, QueryRunner} from "typeorm";

export class share1637801661468 implements MigrationInterface {
    name = 'share1637801661468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`funding_boards\` ADD \`share\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`funding_boards\` ADD UNIQUE INDEX \`IDX_2729e925ea7112c81f9a8f1964\` (\`share\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`funding_boards\` DROP INDEX \`IDX_2729e925ea7112c81f9a8f1964\``);
        await queryRunner.query(`ALTER TABLE \`funding_boards\` DROP COLUMN \`share\``);
    }

}
