import React from "react";
import EmailLayout from "./EmailLayout";

const RefundSuccessfulEmail = ({
  fullName,
  projectName,
}: {
  fullName: string;
  projectName: string;
}) => (
  <EmailLayout>
    <p>
      You have successfully refunded your contribution for project, {projectName}. We're sorry to see you go.
    </p>
    <p>Best,</p>
    <p>{fullName}</p>
    <hr />
    <p>
      You can send us feedback at any time by replying directly to this email!
    </p>
  </EmailLayout>
);

export default RefundSuccessfulEmail;
