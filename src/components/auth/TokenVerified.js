import { Button, Card, Typography } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import React from "react";

const TokenVerified = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  }

  return (
    <div id="content" role="main" className="w-full max-w-md mx-auto p-6">
      <div>
        <Card className="mt-60 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <div className="text-center p-2 bg-blue-100 rounded-md">
              <Typography variant="paragraph">
                Token Verified!
              </Typography>
            </div>
      
            <div className="mt-6">
                <div className="grid gap-y-6">
                  <Button
                    onClick={handleClick}
                    type="submit"
                    className="py-3 px-4 hover:bg-gray-300 hover:text-black w-full"
                  >
                    Login Now
                  </Button>
                </div>
            </div>
          </div>
        </Card>
      </div>
  </div>  
  )
}

export default TokenVerified;

