import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/** Attaches req.user when a valid Bearer token is present; otherwise continues without user. */
const optionalAuthUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next();
  }
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (!error && data.user) {
      req.user = { ...data.user };
    }
  } catch {
    // Invalid or expired token: treat as anonymous for public read
  }
  return next();
};

export default optionalAuthUser;
