import "./LoginScreen.scss";

import * as yup from "yup";

import Button from "../utils/Button/Button";
import Card from "../utils/Card/Card";
import ErrorMessage from "../utils/Input/ErrorMessage";
import Input from "../utils/Input/Input";
import Navbar from "../Navbar/Navbar";
import { ReactElement } from "react";
import Spinner from "../utils/Spinner/Spinner";
import conference_img from "../../assets/images/conference_img.png";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { useLoginMutation } from "../../graphql";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

interface LoginFormData {
  email: string;
  password: string;
}

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("inputErrors.invalidEmailFormat")
    .required("inputErrors.fieldRequired"),
  password: yup.string().required("inputErrors.fieldRequired"),
});

export default function LoginScreen(): ReactElement {
  const { t } = useTranslation("common");

  const [loginMutation, { error, loading }] = useLoginMutation({});
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (loginFormData: LoginFormData) => {
    try {
      const body = await loginMutation({
        variables: {
          input: loginFormData,
        },
      });

      localStorage.setItem("token", body.data?.login?.token ?? "");
      history.push("home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="Container">
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
            {errors.email && <ErrorMessage message={t(errors.email.message)} />}
            <Input
              name="password"
              label={t("components.LoginScreen.passwordLabelText")}
              type="password"
              ref={register}
              error={errors.password}
            />
            {errors.password && (
              <ErrorMessage message={t(errors.password.message)} />
            )}
            {error && <ErrorMessage message={error.message} />}
            {loading && <Spinner />}
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
