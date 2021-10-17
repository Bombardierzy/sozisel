import "./RegisterScreen.scss";

import * as yup from "yup";

import Button from "../utils/Button/Button";
import ErrorMessage from "../utils/Input/ErrorMessage";
import Input from "../utils/Input/Input";
import Navbar from "../Navbar/LoginNavbar/Navbar";
import { ReactElement } from "react";
import SozsielCard from "../utils/Card/SoziselCard";
import Spinner from "../utils/Spinner/Spinner";
import conference_img from "../../assets/images/conference_img.png";
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

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("inputErrors.invalidEmailFormat")
    .required("inputErrors.fieldRequired"),
  firstName: yup.string().required("inputErrors.fieldRequired"),
  lastName: yup.string().required("inputErrors.fieldRequired"),
  password: yup.string().required("inputErrors.fieldRequired"),
  confirmPassword: yup.string().required("inputErrors.fieldRequired"),
});

export default function Register(): ReactElement {
  const { t } = useTranslation("common");

  const [registerMutation, { loading, error }] = useRegisterMutation();
  const history = useHistory();
  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (registerFormData: RegisterFormData) => {
    if (registerFormData.password !== registerFormData.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: t("inputErrors.passwordsNotMatch"),
      });
    } else {
      try {
        await registerMutation({
          variables: {
            input: {
              email: registerFormData?.email,
              firstName: registerFormData?.firstName,
              lastName: registerFormData?.lastName,
              password: registerFormData?.password,
            },
          },
        });

        history.push("login");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="Register">
        <img src={conference_img} />
        <div className="formCardContainer">
          <SozsielCard>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                name="email"
                label={t("components.RegisterScreen.emailLabelText")}
                type="email"
                ref={register}
                error={errors.email}
              />
              {errors.email && (
                <ErrorMessage message={t(errors.email.message)} />
              )}
              <Input
                name="firstName"
                label={t("components.RegisterScreen.firstNameLabelText")}
                type="text"
                ref={register}
                error={errors.firstName}
              />
              {errors.firstName && (
                <ErrorMessage message={t(errors.firstName.message)} />
              )}
              <Input
                name="lastName"
                label={t("components.RegisterScreen.lastNameLabelText")}
                type="text"
                ref={register}
                error={errors.lastName}
              />
              {errors.lastName && (
                <ErrorMessage message={t(errors.lastName.message)} />
              )}
              <Input
                name="password"
                label={t("components.RegisterScreen.passwordLabelText")}
                type="password"
                ref={register}
                error={errors.password}
              />
              {errors.password && (
                <ErrorMessage message={t(errors.password.message)} />
              )}
              <Input
                name="confirmPassword"
                label={t("components.RegisterScreen.confirmPasswordLabelText")}
                type="password"
                ref={register}
                error={errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <ErrorMessage message={t(errors.confirmPassword.message)} />
              )}
              {error && <ErrorMessage message={error.message} />}
              {loading && <Spinner />}
              <Button
                name={t("components.RegisterScreen.submitButtonText")}
                type="submit"
              />
            </form>
          </SozsielCard>
        </div>
      </div>
    </>
  );
}
