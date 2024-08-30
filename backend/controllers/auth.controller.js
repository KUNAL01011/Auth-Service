import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import sendMail from "../utils/sendMail.js";
import crypto from "crypto";

const signup = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    // validation
    if (!email || !name || !password) {
      throw new Error("All filed are required");
    }
    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      throw new Error("User already existed");
    }

    // Hash the password
    const hashPassword = await bcryptjs.hash(password, 10);

    // Generate the random 6 digit code
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save the user data
    const user = new User({
      email,
      name,
      password: hashPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24hours
    });

    await user.save();

    // Sending the mail
    const activationCode = user.verificationToken;
    const data = { user: { name: user.name }, activationCode };
    await sendMail({
      email: user.email,
      subject: "Activate your account",
      template: "activation-mail.ejs",
      data,
    });

    //jwt
    generateTokenAndSetCookie(res, user._id);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Wrong Validation code");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    const data = { user: { name: user.name } };
    await sendMail({
      email: user.email,
      subject: "Welcome",
      template: "welcome-mail.ejs",
      data,
    });

    res.status(200).json({
      success: true,
      message: "Account created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("Email and Password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email and Password not valid");
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Password wrong");
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("This user not found");
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send mail
    const resetLink = `${process.env.RESET_URL}/${user.resetPasswordToken}`;
    const data = { user: { name: user.name, forgotToken: resetLink } };
    await sendMail({
      email: user.email,
      subject: "Forgot Password",
      template: "forgotPassword-mail.ejs",
      data,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Reset Link does not match");
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
export { signup, signin, logout, verifyEmail, forgotPassword,resetPassword,checkAuth };
