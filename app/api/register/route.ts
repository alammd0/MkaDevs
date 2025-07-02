import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/db";
import { sendEmail } from "@/utils/EmailSent";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("Received data:", { email, password });

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and Password are required..." },
        { status: 400 }
      );
    }

    // check given email already exists or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists, please login instead...",
        },
        {
          status: 400,
        }
      );
    }

    // if user not exists, then create new user
    const hashedPassword = await hash(password, 10);

    // generate OTP in Six Digit
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", OTP);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        otp: OTP,
        expiryOtp: new Date(Date.now() + 10 * 60 * 1000),
        verified: false,
      },
    });

    // send OTP to user email
    await sendEmail(
      email,
      "Verify your email with MkaDevs",
      `<h1>Welcome to MkaDevs</h1>
         <p>Your OTP is: <strong>${OTP}</strong></p>
         <p>This OTP is valid for 10 minutes.</p>
         <p>Please do not share this OTP with anyone.</p>`
    );

    // return response
    return NextResponse.json(
      {
        message:
          "User created successfully, please check your email for OTP...",
        user: newUser,
        // otp: OTP,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in user registration:", err);
    return NextResponse.json(
      { message: "Internal Server Error, please try again later..." },
      { status: 500 }
    );
  }
}
