import { createClient } from "@supabase/supabase-js";
import AuthRepository from "../repositories/auth.repository.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const AuthService = {
  register: async ({ email, password, username, name }) => {
    const existingUser = await AuthRepository.getUserByUsername(username);
    if (existingUser) {
      throw createHttpError(400, "This username is already taken");
    }

    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (supabaseError) {
      if (supabaseError.code === "user_already_exists") {
        throw createHttpError(400, "User with this email already exists");
      }

      throw createHttpError(400, "Failed to create user. Please try again.");
    }

    const createdUser = await AuthRepository.createUser({
      id: data.user.id,
      username,
      name,
      role: "user",
    });

    return createdUser;
  },

  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (
        error.code === "invalid_credentials" ||
        error.message.includes("Invalid login credentials")
      ) {
        throw createHttpError(
          400,
          "Your password is incorrect or this email doesn't exist"
        );
      }

      throw createHttpError(400, error.message);
    }

    return data.session.access_token;
  },

  getUser: async (token) => {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      throw createHttpError(401, "Unauthorized or token expired");
    }

    const userProfile = await AuthRepository.getUserById(data.user.id);
    if (!userProfile) {
      throw createHttpError(404, "User profile was not found");
    }

    return {
      id: data.user.id,
      email: data.user.email,
      username: userProfile.username,
      name: userProfile.name,
      role: userProfile.role,
      profilePic: userProfile.profile_pic,
    };
  },
};

export default AuthService;
