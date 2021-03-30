import "./login.scss";

import * as Yup from "yup";

import Button from "../utils/Button/Button";
import Card from "../utils/Card/Card";
import ErrorMessage from "../utils/Input/ErrorMessage";
import Input from "../utils/Input/Input";
import Navbar from "../Navbar/Navbar";
import { ReactElement } from "react";
import conference_img from "../../assets/conference_img.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const fieldRequiredError = "To pole jest wymagane!";

interface LoginFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Niepoprawny format email!")
    .required(fieldRequiredError),
  password: Yup.string().required(fieldRequiredError),
});

export default function Login(): ReactElement {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <img src={conference_img} />
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              name="email"
              label="Email"
              type="email"
              ref={register}
              error={errors.email}
            />
            {errors.email && <ErrorMessage message={errors.email.message} />}
            <Input
              name="password"
              label="Hasło"
              type="password"
              ref={register}
              error={errors.password}
            />
            {errors.password && (
              <ErrorMessage message={errors.password.message} />
            )}
            <Button type="submit" name="Zaloguj się" />
          </form>
        </Card>
      </div>
    </>
  );
}
