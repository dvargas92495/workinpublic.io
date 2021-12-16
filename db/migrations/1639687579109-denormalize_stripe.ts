import { MigrationInterface, QueryRunner } from "typeorm";
import { stripe } from "../../functions/_common";

export class denormalizeStripe1639687579109 implements MigrationInterface {
  name = "denormalizeStripe1639687579109";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`projects\` DROP COLUMN \`progress\``
    );
    await queryRunner.query(
      `ALTER TABLE \`project_backers\` ADD \`amount\` int NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE \`project_backers\` ADD \`refunded\` tinyint NOT NULL DEFAULT 0`
    );
    const rows = await queryRunner.query(
      `SELECT \`pb\`.\`payment_intent\` from \`project_backers\` pb`
    );
    for (const { payment_intent } of rows) {
      await Promise.all([
        stripe.paymentIntents.retrieve(payment_intent),
        stripe.refunds.list({ payment_intent }),
      ])
        .then(([p, r]) =>
          queryRunner.query(
            `UPDATE \`project_backers\` SET amount = ${p.amount}, refunded = ${r.data.length}`
          )
        )
        .then(() => new Promise((resolve) => setTimeout(resolve, 50)));
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`project_backers\` DROP COLUMN \`refunded\``
    );
    await queryRunner.query(
      `ALTER TABLE \`project_backers\` DROP COLUMN \`amount\``
    );
    await queryRunner.query(
      `ALTER TABLE \`projects\` ADD \`progress\` int UNSIGNED NOT NULL DEFAULT '0'`
    );
  }
}
