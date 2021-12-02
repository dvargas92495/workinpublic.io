import {MigrationInterface, QueryRunner} from "typeorm";

export class projectideas1638405680098 implements MigrationInterface {
    name = 'projectideas1638405680098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`project_ideas\` (\`uuid\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`reviewed\` tinyint NOT NULL, \`fundingBoardUuid\` varchar(36) NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`project_ideas\` ADD CONSTRAINT \`FK_ee76fcfc86b304109aba6d902d1\` FOREIGN KEY (\`fundingBoardUuid\`) REFERENCES \`funding_boards\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_ideas\` DROP FOREIGN KEY \`FK_ee76fcfc86b304109aba6d902d1\``);
        await queryRunner.query(`DROP TABLE \`project_ideas\``);
    }

}
