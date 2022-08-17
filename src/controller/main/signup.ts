import { Request, Response } from "express";
import User from "@src/model/user";

export const SignUp = async (request: Request, response: Response) => {
  const { firstName, lastName, born, email, password } = request.body as any;

  if (!firstName || !lastName || !born || !email || !password) {
    response.status(400);
    response.json({
      success: false,
      message: "missing first name, last name, born, email or password value",
    });
    return;
  }

  try {
    await User.find({ email: email }).then(async (data) => {
      const user = data[0];
      if (user) {
        response.status(409).json({
          success: false,
          message: "user already exists",
        });
        return;
      }

      const newUser = new User({
        name: {
          first: firstName,
          last: lastName,
        },
        email: email,
        born: born,
        password: password,
        profiles: [
          {
            name: firstName,
          },
        ],
        verified: false,
      });

      /* send token confirmation */
      newUser.buildToken();
      newUser.sendToken();

      await newUser.setPassword(password);
      newUser.save();

      response.status(201).json({
        success: true,
        message: "successfully created",
      });
      return;
    });
  } catch (err) {
    response.status(500).json({
      success: false,
      message: "server error",
    });
    return;
  }
};
