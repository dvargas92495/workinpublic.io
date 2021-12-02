import React from "react";
import EmailLayout from "./EmailLayout";

const NewProjectIdeaEmail = ({
  fullName,
  name,
  boardName,
  description,
  email,
}: {
  fullName: string;
  name: string;
  boardName: string;
  description: string;
  email: string;
}) => (
  <EmailLayout>
    <p>Hi {fullName},</p>
    <p>
      A new project idea has been submitted for your Funding Board, {boardName}!
    </p>
    <p>
      <b>Name:</b><br/>
      {name}
    </p>
    <p>
      <b>Description:</b><br/>
      {description}
    </p>
    <hr/>
    <p>
      This project idea was submitted by {email}. To ask them more about it, simply reply to this email!
    </p>
    <p>
        <a href={`${process.env.HOST}/user`}>Click here</a> to review this idea. 
    </p>
  </EmailLayout>
);

export default NewProjectIdeaEmail;
