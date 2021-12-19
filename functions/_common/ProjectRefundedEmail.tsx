import React from "react";
import EmailLayout from "./EmailLayout";

const ProjectRefundedEmail = ({
  fullName,
  amount,
  projectName,
  email,
}: {
  fullName: string;
  amount: number;
  projectName: string;
  email: string;
}) => (
  <EmailLayout>
    <p>Hi {fullName},</p>
    <p>
      We regret to inform you that a recent backer, {email}, has just refunded
      their contribution of ${amount} for your project, {projectName}.
    </p>
    <hr />
    <p>To ask them for feedback, simply reply to this email!</p>
  </EmailLayout>
);

export default ProjectRefundedEmail;
