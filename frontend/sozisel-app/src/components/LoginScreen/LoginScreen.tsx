import "./LoginScreen.scss";

import * as yup from "yup";

import React, { ReactElement, useEffect } from "react";

import Button from "../utils/Button/Button";
import ErrorMessage from "../utils/Input/ErrorMessage";
import Input from "../utils/Input/Input";
import Navbar from "../Navbar/LoginNavbar/Navbar";
import ShadowBoxCard from "../utils/Card/ShadowBoxCard";
import Spinner from "../utils/Spinner/Spinner";
import { USER_TOKEN } from "../../common/consts";
import conferenceImg from "../../assets/images/conference_img.png";
import { useApolloClient } from "@apollo/client";
import { useForm } from "react-hook-form";
import useGetErrorMessage from "../../hooks/useGetErrorMessage";
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

  const getErrorMessage = useGetErrorMessage();
  const [loginMutation, { error, loading }] = useLoginMutation({});
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const client = useApolloClient();

  useEffect(() => {
    client.clearStore();
  }, [client]);

  const onSubmit = async (loginFormData: LoginFormData) => {
    try {
      const body = await loginMutation({
        variables: {
          input: loginFormData,
        },
      });

      localStorage.setItem(USER_TOKEN, body.data?.login?.token ?? "");

      // You may ask yourself, why don't you just use react-router, it should work, right?
      // Well, the answer is quite surprising, it does not work as we intend it to work.
      // React-Router itself does not refresh the page.
      // Without refreshing the page the apollo cache seems to fail to notify an `AuthRoute` component about
      // new user logged in. Therefore we are left with a white loading screen (an empty react fragment).
      // There was once a better comment explaining it (way shorter and more explanatory) but somebody didn't like it (screw you).
      window.location.href = "/home";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="Login">
        <img src={conferenceImg} />
        <div className="formCardContainer">
          <ShadowBoxCard className="formCard">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                name="email"
                label={t("components.LoginScreen.emailLabelText")}
                type="email"
                ref={register}
                error={errors.email}
              />
              {errors.email && (
                <ErrorMessage message={t(errors.email.message)} />
              )}
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
              {error && (
                <div className="errorContainer">
                  <ErrorMessage message={getErrorMessage(error)} />
                </div>
              )}
              {loading && <Spinner />}
              <Button
                type="submit"
                name={t("components.LoginScreen.submitButtonText")}
              />
            </form>
          </ShadowBoxCard>
        </div>
      </div>
    </>
  );
}
