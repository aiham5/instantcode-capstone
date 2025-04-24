const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./prisma/client");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          const email = profile.emails[0].value;
          const baseUsername =
            profile.displayName?.replace(/\s+/g, "").toLowerCase() || "user";
          let username = baseUsername;
          let suffix = 1;

          while (true) {
            try {
              user = await prisma.user.create({
                data: {
                  email,
                  username,
                  image: profile.photos[0].value,
                  password: "",
                },
              });
              break;
            } catch (err) {
              if (
                err.code === "P2002" &&
                err.meta?.target?.includes("username")
              ) {
                username = `${baseUsername}${suffix++}`;
              } else {
                throw err;
              }
            }
          }
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});
