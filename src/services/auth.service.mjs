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
      options: {
        data: {
          username,
          name,
        },
      },
    });

    if (supabaseError) {
      if (supabaseError.code === "user_already_exists") {
        throw createHttpError(400, "User with this email already exists");
      }

      throw createHttpError(400, "Failed to create user. Please try again.");
    }
    return {
      id: data.user?.id,
      email: data.user?.email ?? email,
      username,
      name,
      role: "user",
    };
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
      bio: userProfile.bio,
    };
  },

  updateProfile: async (accessToken, { name, username, bio, profilePic }) => {
    const { data: authUserData, error: authUserError } =
      await supabase.auth.getUser(accessToken);
    if (authUserError || !authUserData.user?.id) {
      throw createHttpError(401, "Unauthorized or token expired");
    }

    const normalizedUsername = username.trim();
    const normalizedName = name.trim();
    const normalizedBio = typeof bio === "string" ? bio.trim() : "";
    const normalizedProfilePic =
      typeof profilePic === "string" ? profilePic.trim() : "";

    const existingUsername = await AuthRepository.getUserByUsernameExcludingId(
      normalizedUsername,
      authUserData.user.id,
    );
    if (existingUsername) {
      throw createHttpError(400, "This username is already taken");
    }

    const updatedUser = await AuthRepository.updateUserProfile({
      id: authUserData.user.id,
      name: normalizedName,
      username: normalizedUsername,
      bio: normalizedBio,
      profilePic: normalizedProfilePic,
    });

    if (!updatedUser) {
      throw createHttpError(404, "User profile was not found");
    }

    return {
      id: authUserData.user.id,
      email: authUserData.user.email,
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role,
      profilePic: updatedUser.profile_pic,
      bio: updatedUser.bio,
    };
  },

  /**
   * Change password for authenticated user.
   * Requires currentPassword verification before update.
   */
  resetPassword: async (
    accessToken,
    { currentPassword, newPassword, confirmPassword }
  ) => {
    const supabaseAuthed = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      },
    );

    // Resolve current user's email from access token first.
    const { data: authUserData, error: authUserError } =
      await supabaseAuthed.auth.getUser();
    if (authUserError || !authUserData.user?.email) {
      throw createHttpError(401, "Unauthorized or token expired");
    }

    if (newPassword !== confirmPassword) {
      throw createHttpError(400, "newPassword and confirmPassword do not match");
    }

    // Verify current password using the same authed client.
    // This ensures the client has an active session before updateUser.
    const { error: verifyCurrentPasswordError } =
      await supabaseAuthed.auth.signInWithPassword({
        email: authUserData.user.email,
        password: currentPassword,
      });

    if (verifyCurrentPasswordError) {
      throw createHttpError(400, "Current password is incorrect");
    }

    const { error } = await supabaseAuthed.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw createHttpError(400, error.message || "Could not update password");
    }

    return { message: "Password updated successfully" };
  },
};

export default AuthService;
