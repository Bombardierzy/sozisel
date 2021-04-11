import * as yup from "yup";

import { ReactElement, useState } from "react";

import Button from "../utils/Button/Button";
import Card from "../utils/Card/Card";
import ErrorMessage from "../utils/Input/ErrorMessage";
import Input from "../utils/Input/Input";
import Navbar from "../Navbar/Navbar";
import Spinner from "../utils/Spinner/Spinner";
import conference_img from "../../assets/conference_img.png";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { useRegisterMutation } from "../../graphql";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

interface RegisterFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export default function Register(): ReactElement {
  const { t } = useTranslation("common");

  const registerSchema = yup.object().shape({
    email: yup
      .string()
      .email("Niepoprawny format email!")
      .required(t("errorMessages.fieldRequired")),
    firstName: yup.string().required(t("errorMessages.fieldRequired")),
    lastName: yup.string().required(t("errorMessages.fieldRequired")),
    password: yup.string().required(t("errorMessages.fieldRequired")),
    confirmPassword: yup.string().required(t("errorMessages.fieldRequired")),
  });

  const [registerMutation, { loading }] = useRegisterMutation();
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (registerFormData: RegisterFormData) => {
    setError(null);
    if (registerFormData.password !== registerFormData.confirmPassword) {
      setError(t("errorMessages.passwordsNotMatch"));
    } else {
      try {
        await registerMutation({
          variables: {
            input: {
              email: registerFormData?.email,
              firstName: registerFormData?.lastName,
              lastName: registerFormData?.lastName,
              password: registerFormData?.password,
            },
          },
        });

        history.push("login");
      } catch (error) {
        setError(error.message);
      }
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
              label={t("components.RegisterScreen.emailLabelText")}
              type="email"
              ref={register}
              error={errors.email}
            />
            {errors.email && <ErrorMessage message={errors.email.message} />}
            <Input
              name="firstName"
              label={t("components.RegisterScreen.firstNameLabelText")}
              type="text"
              ref={register}
              error={errors.firstName}
            />
            {errors.firstName && (
              <ErrorMessage message={errors.firstName.message} />
            )}
            <Input
              name="lastName"
              label={t("components.RegisterScreen.lastNameLabelText")}
              type="text"
              ref={register}
              error={errors.lastName}
            />
            {errors.lastName && (
              <ErrorMessage message={errors.lastName.message} />
            )}
            <Input
              name="password"
              label={t("components.RegisterScreen.passwordLabelText")}
              type="password"
              ref={register}
              error={errors.password}
            />
            {errors.password && (
              <ErrorMessage message={errors.password.message} />
            )}
            <Input
              name="confirmPassword"
              label={t("components.RegisterScreen.confirmPasswordLabelText")}
              type="password"
              ref={register}
              error={errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <ErrorMessage message={errors.confirmPassword.message} />
            )}
            {error !== null && <ErrorMessage message={error} />}
            {loading && <Spinner />}
            <Button
              name={t("components.RegisterScreen.submitButtonText")}
              type="submit"
            />
          </form>
        </Card>
      </div>
    </>
  );
}
