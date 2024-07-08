

import * as React from 'react';

interface EmailTemplateProps {
    confirmLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    confirmLink,
}) => (
  <div>
    <h1>Password reset!</h1>
    <a href={confirmLink}>Click here to choose a new password</a>
  </div>
);