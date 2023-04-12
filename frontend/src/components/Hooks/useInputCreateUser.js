import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

export const useInputCreateUser = () => {
  const schema = yup
    .object({
      name: yup.string().max(255).required("Merci d'entrer votre nom"),
      email: yup
        .string()
        .email("Merci de rentrer une adreese mail valide")
        .max(255)
        .required("Merci de rentrer une adresse mail valide"),
      password: yup
        .string()
        .min(8, "Le mot de passe doit comporter au moins 8 caractères")
        .matches(
          /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
          "Le mot de passe doit comporter au moins une lettre majuscule, un caractère spécial et un chiffre"
        )
        .max(255)
        .required("Merci de rentrer un mot de passe valide"),
    })

    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  return [register, handleSubmit, errors];
};
