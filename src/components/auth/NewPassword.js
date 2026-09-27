import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import React from "react";
import { resetPassword } from "../../services/staticDataService";

const NewPassword = () => {
  const navigate = useNavigate();
  const { token, email } = useParams();
  const { control, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("Submitting data: ", { email, token, password: data.new_password });

      const response = await resetPassword(decodeURIComponent(email), token, data.new_password);
      console.log("Server Response: ", response);

      if (response.status === 1) {
        navigate("/changed-password");
        alert("Password reset successfully!");
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error during password reset request: ", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div id="content" role="main" className="w-full max-w-md mx-auto p-6">
      <Card className="mt-60 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6">
          <div className="text-center">
            <Typography variant="h1" className="text-2xl font-bold text-black">
              New Password
            </Typography>
          </div>

          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-y-6">
                <div className="mt-4">
                  <Controller
                    name="new_password"
                    control={control}
                    rules={{
                      required: "Password is required.",
                      minLength: {
                        value: 4,
                        message: "Minimum of 4 characters is required.",
                      },
                    }}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        size="lg"
                        type="password"
                        label="Enter New Password"
                        placeholder="*****"
                        {...field}
                        error={Boolean(errors?.new_password?.message)}
                      />
                    )}
                  />
                  {errors?.new_password?.message && (
                    <span className="error-text">{errors?.new_password?.message}</span>
                  )}
                </div>
                <div>
                  <Controller
                    name="confirm_password"
                    control={control}
                    rules={{
                      required: "Please confirm your password.",
                      validate: (value) =>
                        value === watch("new_password") || "Passwords do not match.",
                    }}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        size="lg"
                        type="password"
                        label="Confirm Password"
                        placeholder="*****"
                        {...field}
                        error={Boolean(errors?.confirm_password?.message)}
                      />
                    )}
                  />
                  {errors?.confirm_password?.message && (
                    <span className="error-text">{errors?.confirm_password?.message}</span>
                  )}
                </div>

                <Button type="submit" className="py-3 px-4 hover:bg-gray-300 hover:text-black">
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NewPassword;

