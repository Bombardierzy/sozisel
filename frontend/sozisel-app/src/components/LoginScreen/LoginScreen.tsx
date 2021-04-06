import "./LoginScreen.scss";

import * as Yup from "yup";

import Button from "../utils/Button/Button";
import Card from "../utils/Card/Card";
import ErrorMessage from "../utils/Input/ErrorMessage";
import Input from "../utils/Input/Input";
import Navbar from "../Navbar/Navbar";
import { ReactElement } from "react";
import conference_img from "../../assets/conference_img.png";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { useLoginMutation } from "../../graphql";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen(): ReactElement {
  const { t } = useTranslation("common");

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("errorMessages.invalidEmailFormat"))
      .required(t("errorMessages.fieldRequired")),
    password: Yup.string().required(t("errorMessages.fieldRequired")),
  });

  const [loginMutation, { error }] = useLoginMutation({});
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (loginFormData: LoginFormData) => {
    try {
      const body = await loginMutation({
        variables: {
          input: {
            ...loginFormData,
          },
        },
      });
      localStorage.setItem("token", body.data?.login?.token ?? "");
      history.push("");
    } catch (error) {
      console.error(error);
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
              label={t("components.LoginScreen.emailLabelText")}
              type="email"
              ref={register}
              error={errors.email}
            />
            {errors.email && <ErrorMessage message={errors.email.message} />}
            <Input
              name="password"
              label={t("components.LoginScreen.passwordLabelText")}
              type="password"
              ref={register}
              error={errors.password}
            />
            {errors.password && (
              <ErrorMessage message={errors.password.message} />
            )}
            {error && <ErrorMessage message={error.message} />}
            <Button
              type="submit"
              name={t("components.LoginScreen.submitButtonText")}
            />
          </form>
        </Card>
      </div>
    </>
  );
}
