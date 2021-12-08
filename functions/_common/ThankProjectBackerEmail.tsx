import React from "react";
import EmailLayout from "./EmailLayout";

const NewProjectBackerEmail = ({
  fullName,
  projectName,
  uuid,
}: {
  fullName: string;
  projectName: string;
  uuid: string;
}) => (
  <EmailLayout>
    <p>
      Thank you for funding my project {projectName}! Stay tuned for updates!
    </p>
    <p>Best,</p>
    <p>{fullName}</p>
    <hr />
    <p>
      You can pull your funding at any time before the project finishes by
      clicking on <a href={`${process.env.HOST}/refund?id=${uuid}`}>this link.</a>
    </p>
  </EmailLayout>
);

export default NewProjectBackerEmail;
