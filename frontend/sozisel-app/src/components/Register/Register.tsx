import "./register.scss";

import * as Yup from "yup";

import { ReactElement, useState } from "react";

import Button from "../utils/Button/Button";
import Card from "../utils/Card/Card";
import ErrorMessage from "../utils/Input/ErrorMessage";
import Input from "../utils/Input/Input";
import Navbar from "../Navbar/Navbar";
import conference_img from "../../assets/conference_img.png";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { useRegisterMutation } from "../../graphql";
import { yupResolver } from "@hookform/resolvers/yup";

interface RegisterFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const fieldRequiredError = "To pole jest wymagane!";
const passwordsNotMatchError = "Podane hasła nie są identyczne!";

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email("Niepoprawny format email!")
    .required(fieldRequiredError),
  firstName: Yup.string().required(fieldRequiredError),
  lastName: Yup.string().required(fieldRequiredError),
  password: Yup.string().required(fieldRequiredError),
  confirmPassword: Yup.string().required(fieldRequiredError),
});

export default function Register(): ReactElement {
  const [registerMutation] = useRegisterMutation();
  const [error, setError] = useState<string>("");
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = (registerFormData: RegisterFormData) => {
    if (registerFormData.password !== registerFormData.confirmPassword) {
      setError(passwordsNotMatchError);
    } else {
      registerMutation({
        variables: {
          email: registerFormData?.email,
          firstName: registerFormData?.lastName,
          lastName: registerFormData?.lastName,
          password: registerFormData?.password,
        },
      })
        .then((data) => {
          console.log(data);
          history.push("login");
          setError("");
        })
        .catch((err) => setError(err.message));
    }
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
              name="firstName"
              label="Imię"
              type="text"
              ref={register}
              error={errors.firstName}
            />
            {errors.firstName && (
              <ErrorMessage message={errors.firstName.message} />
            )}
            <Input
              name="lastName"
              label="Nazwisko"
              type="text"
              ref={register}
              error={errors.lastName}
            />
            {errors.lastName && (
              <ErrorMessage message={errors.lastName.message} />
            )}
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
            {error !== "" && <ErrorMessage message={error} />}
            <Button name="Zajerestruj się" type="submit" />
          </form>
        </Card>
      </div>
    </>
  );
}
