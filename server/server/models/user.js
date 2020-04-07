import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_I = 10;
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: 1,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstname: {
      type: String,
      maxlength: 100,
    },
    lastname: {
      type: String,
      maxlength: 100,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    role: {
      type: Number,
      default: 0,
    },
    affiliation: {
      type: String,
      default: "Independent Writer",
    },
    token: {
      type: String,
    },
    avatar: {
      type: String,
      default: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(SALT_I, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(
    user._id.toHexString(),
    process.env.SECRET || "SUPERSECRETPASSWORD123"
  );

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  jwt.verify(token, process.env.SECRET || "SUPERSECRETPASSWORD123", function (
    err,
    decode
  ) {
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

userSchema.methods.deleteToken = function (token, cb) {
  var user = this;

  user.update({ $unset: { token: 1 } }, (err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
};

export default mongoose.model("User", userSchema);
