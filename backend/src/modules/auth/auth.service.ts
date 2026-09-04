import * as bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../lib/jwt";
import { authRepository } from "./auth.repository";

export const authService = {
  async register(
    name: string,
    email: string,
    password: string,
    phone?: string,
    address?: string,
    role?: string,
  ) {
    const existing = await authRepository.findByEmail(email);
    if (existing) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await authRepository.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: role ?? "customer",
    });

    const token = jwt.sign(
      { sub: user.uuid, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return {
      token,
      user: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcryptjs.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      { sub: user.uuid, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return {
      token,
      user: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async forgotPassword(email: string) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      return {
        message: "Email not found",
      };
    }

    const resetToken = jwt.sign(
      { sub: String(user.id), type: "password_reset" },
      JWT_SECRET,
      { expiresIn: "15m" },
    );
    return {
      message: "If that email is registered, you will receive a reset link",
      token: resetToken,
    };
  },

  async resetPassword(token: string, newPassword: string) {
    let payload: { sub: string; type: string };
    try {
      payload = jwt.verify(token, JWT_SECRET) as { sub: string; type: string };
    } catch {
      throw new Error("Invalid or expired reset token");
    }

    if (payload.type !== "password_reset") {
      throw new Error("Invalid reset token");
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await authRepository.updatePassword(Number(payload.sub), hashedPassword);

    return { message: "Password reset successfully" };
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await authRepository.findById(Number(userId));
    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await bcryptjs.compare(currentPassword, user.password);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await authRepository.updatePassword(Number(userId), hashedPassword);

    return { message: "Password changed successfully" };
  },

  async updateProfile(userId: string, data: { name?: string }) {
    const user = await authRepository.updateProfile(Number(userId), data);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
};
