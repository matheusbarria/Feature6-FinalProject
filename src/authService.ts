import Parse from "parse";
import { User } from "./types";

export class AuthService {
  private static readonly TOKEN_KEY = "auth_token";

  static async login(email: string, password: string): Promise<User> {
    try {
      const parseUser = await Parse.User.logIn(email, password);
      const user = this.convertParseUserToUser(parseUser);
      this.setToken(parseUser.getSessionToken());
      return user;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error(
        error.message || "Login failed. Please check your credentials."
      );
    }
  }

  static async signup(email: string, password: string): Promise<User> {
    try {
      const user = new Parse.User();
      user.set("username", email); // Parse requires username
      user.set("email", email);
      user.set("password", password);

      const parseUser = await user.signUp();
      const newUser = this.convertParseUserToUser(parseUser);
      this.setToken(parseUser.getSessionToken());
      return newUser;
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error(error.message || "Signup failed. Please try again.");
    }
  }

  private static convertParseUserToUser(parseUser: Parse.User): User {
    return {
      id: parseUser.id,
      email: parseUser.get("email"),
      username: parseUser.get("username"),
      // Add any other user fields you need
    };
  }

  private static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static logout(): void {
    Parse.User.logOut();
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return Parse.User.current() !== null;
  }

  static getCurrentUser(): User | null {
    const parseUser = Parse.User.current();
    if (!parseUser) return null;
    return this.convertParseUserToUser(parseUser);
  }
}
