import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import emailjs from "@emailjs/browser";
import React, { useRef, useState } from "react";
import { forgotPassword } from "../../services/staticDataService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const { control, handleSubmit, formState: { errors } } = useForm();

  const handleClick = () => {
    navigate("/user-signup")
  }

  const sendEmail = async () => {
    try {
      const result = await emailjs.sendForm(
        "service_7ugsqbs",
        "template_q55l8yp",
        formRef.current,
        "aIJKJSFtAVhhKA7Cd"
      );
      console.log("Email sent successfully: ", result.text);
      return true;
    } catch (error) {
      console.error("Email sending failed: ", error.text);
      return false;
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log("Submitting data: ", data);

      const response = await forgotPassword(data.user_email);
      console.log("Server Response: ", response);

      if (response.status === 1) {
        setFirstName(response.first_name);
        setSurname(response.surname);
        setResetLink(response.reset_link);
        setUserEmail(data.user_email);

        const messageWithLink = `You recently requested to reset your password. Please use the following link to reset your password: ${response.reset_link}`;

        console.log("Form Values before sending email:", {
          first_name: response.first_name,
          surname: response.surname,
          subject: "Password Reset Request",
          message: messageWithLink,
          email_from: "HireSphere@gmail.com",
          email_to: data.user_email
        });

        formRef.current.first_name.value = response.first_name;
        formRef.current.surname.value = response.surname;
        formRef.current.subject.value = "Password Reset Request";
        formRef.current.message.value = messageWithLink;
        formRef.current.email_to.value = data.user_email;

        if (await sendEmail()) {
          navigate("/email-sent", { state: { email: data.user_email } }); 
        } else {
          alert("Failed to send email. Please try again.");
        }
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error during password reset request: ", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div id="content" role="main" className="mt-60 w-full max-w-md mx-auto p-6">
      <div>
        <div className="flex justify-self-start">
          <Button onClick={handleClick} className="hover:bg-gray-300 hover:text-black">
            <FontAwesomeIcon icon={faShare} flip="horizontal" className="h-5 w-5" />
          </Button>
        </div>
        <Card className="mt-4 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <div className="text-center">
              <Typography variant="h1" className="text-2xl font-bold text-black">
                Forgot password?
              </Typography>
              <div className="mt-2 text-center p-2 bg-gray-300 rounded-md">
                <Typography variant="paragraph">
                Please enter the email address associated with your account. 
                This should be the email you use to log in.
                </Typography>
              </div>
            </div>

            <div>
              <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-y-6">
                  <div className="mt-4">
                    <Controller
                      name="user_email"
                      control={control}
                      rules={{
                        required: "Email Address is required.",
                        pattern: {
                          value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                          message: "Email Address is invalid.",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="email"
                          size="lg"
                          label="Enter Email Address"
                          placeholder="example@email.com"
                          error={Boolean(errors?.user_email?.message)}
                        />
                      )}
                    />
                    {errors?.user_email?.message && (
                      <span className="text-xs text-red-500 mt-2">{errors?.user_email?.message}</span>
                    )}
                  </div>

                  <input type="hidden" name="first_name" value={firstName} />
                  <input type="hidden" name="surname" value={surname} />
                  <input type="hidden" name="subject" value="Password Reset Request" />
                  <input type="hidden" name="message" value={`You recently requested to reset your password. Please use the following link to reset your password: ${resetLink}`} />
                  <input type="hidden" name="email_from" value="HireSphere@gmail.com" />
                  <input type="hidden" name="email_to" value={userEmail} />

                  <Button type="submit" className="py-3 px-4 hover:bg-gray-300 hover:text-black">
                    Send Code
                  </Button>

                  <div className="text-center">
                    <Typography variant="paragraph" className="text-sm text-gray-600">
                      Remember your password?
                      <NavLink to="/user-login">
                        <label className="cursor-pointer hover:underline hover:text-blue-500 font-medium ml-1">
                          Login here
                        </label>
                      </NavLink>
                    </Typography>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;

