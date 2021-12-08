import React from "react";
import EmailLayout from "./EmailLayout";

const NewProjectBackerEmail = ({
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
      A new backer has just contributed ${amount} to your project, {projectName}!
    </p>
    <hr/>
    <p>
      This project was funded by {email}. To thank them, simply reply to this email!
    </p>
  </EmailLayout>
);

export default NewProjectBackerEmail;
