import Joi from "joi";

export const registerDto = (
  first_name,
  last_name,
  email,
  username,
  password,
  confirm_password
) => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().optional(),
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/
      )
      .required(),
    confirm_password: Joi.string().required(),
  });
  let { error } = schema.validate(
    { first_name, last_name, email, username, password, confirm_password },
    { abortEarly: false }
  );
  let message = [];
  if (password !== confirm_password) {
    message.push("password and confirm_password must be same.");
  }
  if (error) {
    message = [...message, ...error.details.map((item) => item?.message)];
  }
  if (message?.length > 0) {
    return {
      success: false,
      error: message,
    };
  } else {
    return { success: true, error: null };
  }
};

export const loginDto = (email_or_username, password) => {
  const schema = Joi.object({
    email_or_username: Joi.string().required(),
    password: Joi.string().required(),
  });
  let { error } = schema.validate(
    { email_or_username, password },
    { abortEarly: false }
  );
  if (error) {
    return {
      success: false,
      error: error.details.map((item) => item?.message),
    };
  } else {
    return { success: true, error: null };
  }
};

export const createBlogDto = (title, description, category) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
  });
  let { error } = schema.validate(
    { title, description, category },
    { abortEarly: false }
  );
  if (error) {
    return {
      success: false,
      error: error.details.map((item) => item?.message),
    };
  } else {
    return { success: true, error: null };
  }
};

export const updateBlogDto = (title, description, category) => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    category:Joi.string().optional(),
  });
  let { error } = schema.validate(
    { title, description, category },
    { abortEarly: false }
  );
  if (error) {
    return {
      success: false,
      error: error.details.map((item) => item?.message),
    };
  } else {
    return { success: true, error: null };
  }
};

export const commentDto = (comment) => {
  const schema = Joi.object({
    comment: Joi.string().required(),
  });
  let { error } = schema.validate({ comment }, { abortEarly: false });
  if (error) {
    return {
      success: false,
      error: error.details.map((item) => item?.message),
    };
  } else {
    return { success: true, error: null };
  }
};
