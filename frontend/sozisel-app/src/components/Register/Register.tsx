import "./register.scss";

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

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email("Niepoprawny format email!")
    .required(fieldRequiredError),
  password: Yup.string().required(fieldRequiredError),
  confirmPassword: Yup.string().required(fieldRequiredError),
});

export default function Register(): ReactElement {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = (data: any) => {
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
            <Input
              name="confirmPassword"
              label="Potwierdz hasło"
              type="password"
              ref={register}
              error={errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <ErrorMessage message={errors.confirmPassword.message} />
            )}
            <Button name="Zajerestruj się" type="submit" />
          </form>
        </Card>
      </div>
    </>
  );
}
