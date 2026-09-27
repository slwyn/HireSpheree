import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { NavLink } from 'react-router-dom';
import React from "react";

const ChangedPassword = () => {
  return (
    <div id="content" role="main" className="w-full max-w-md mx-auto p-6">
      <div>
        <Card className="mt-60 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <div className="text-center p-2 bg-blue-100 rounded-md">
              <Typography variant="paragraph">
                Your password has changed. Now you can login with your new password.
              </Typography>
            </div>
      
            <div className="mt-6">
                <div className="grid gap-y-6">
                  <NavLink to={'/user-info'}>
                    <Button
                      type="submit"
                      className="py-3 px-4 hover:bg-gray-300 hover:text-black w-full"
                    >
                      Login Now
                    </Button>
                  </NavLink>
                </div>
            </div>
          </div>
        </Card>
      </div>
  </div>  
  )
}

export default ChangedPassword;

