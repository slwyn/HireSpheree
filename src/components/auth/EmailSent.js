import { Button, Card, Typography } from "@material-tailwind/react";
import React from "react";
import { useLocation } from "react-router-dom";

const EmailSent = () => {
  const location = useLocation();
  const { email } = location.state || {};

  const handleGoToGmail = () => {
    window.location.href = "https://mail.google.com/";
  };

  return (
    <div id="content" role="main" className="w-full">
      <div className="px-[720px]">
        <Card className="mt-60 p-4 bg-white rounded-xl shadow-lg">
          <div>
            <div className="text-center p-14 bg-blue-100 rounded-md">
              <Typography variant="paragraph">
                An email has been sent to your email address.
              </Typography>
              {email && (
                <span className="block mt-2 text-blue-500 font-medium">{email}</span>
              )}
              <Button
                onClick={handleGoToGmail}
                className="py-3 px-4 hover:bg-gray-300 hover:text-black w-full mt-6"
              >
                Go to Gmail
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmailSent;

