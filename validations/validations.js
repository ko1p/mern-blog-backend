import { body } from "express-validator";

export const registerValidation = [
  body("email", "Неверный формат почты.").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов.").isLength({
    min: 5,
  }),
  body("fullName", "Укажите имя.").isLength({ min: 3 }),
  body("avatarUrl", "Неверная ссылка на аватар.").optional().isURL(),
];

export const loginValidation = [
  body("email", "Неверный формат почты.").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов.").isLength({
    min: 5,
  }),
];

export const postCreateValidation = [
    body("title", "Введите заголовок статьи.").isLength({ min: 3 }).isString(),
    body("text", "Введите текст статьи.").isLength({ min: 3 }).isString(),
    body("tags", "Неверный формате тегов.").optional().isArray(),
    body("imageUrl", "Неверная ссылка на изображение.").optional().isString(),
];