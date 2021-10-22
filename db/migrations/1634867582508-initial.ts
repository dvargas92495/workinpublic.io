import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1634867582508 implements MigrationInterface {
    name = 'initial1634867582508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`funding_board_projects\` (\`uuid\` char(36) NOT NULL, \`fundingBoardUuid\` char(36) NULL, \`projectUuid\` char(36) NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`funding_boards\` (\`uuid\` char(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`projects\` (\`uuid\` char(36) NOT NULL, \`link\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`target\` int UNSIGNED NOT NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`funding_board_projects\` ADD CONSTRAINT \`FK_385514b8049155a87175e589b8d\` FOREIGN KEY (\`fundingBoardUuid\`) REFERENCES \`funding_boards\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`funding_board_projects\` ADD CONSTRAINT \`FK_824b376d89cd75a6fc7d0d74107\` FOREIGN KEY (\`projectUuid\`) REFERENCES \`projects\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`funding_board_projects\` DROP FOREIGN KEY \`FK_824b376d89cd75a6fc7d0d74107\``);
        await queryRunner.query(`ALTER TABLE \`funding_board_projects\` DROP FOREIGN KEY \`FK_385514b8049155a87175e589b8d\``);
        await queryRunner.query(`DROP TABLE \`projects\``);
        await queryRunner.query(`DROP TABLE \`funding_boards\``);
        await queryRunner.query(`DROP TABLE \`funding_board_projects\``);
    }

}
