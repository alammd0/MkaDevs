import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!otp || !email) {
      return NextResponse.json(
        {
          message: "Email and OTP is required for verification...",
        },
        {
          status: 400,
        }
      );
    }

    // find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // not find user
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found, please register first...",
        },
        {
          status: 404,
        }
      );
    }

    // check if user already verified
    if (user.verified) {
      return NextResponse.json(
        {
          message: "user already verified, please login...",
        },
        { status: 400 }
      );
    }

    // check if otp is valid or not
    if (user.otp !== otp) {
      return NextResponse.json(
        {
          message: "Invalid OTP, please try again...",
        },
        {
          status: 400,
        }
      );
    }

    // check if otp is expired or not
    if (user.expiryOtp < new Date()) {
      return NextResponse.json(
        {
          message: "OTP is expired, please request a new OTP...",
        },
        {
          status: 400,
        }
      );
    }

    // update user verified status
    const updateUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        verified: true,
        otp: "",
        expiryOtp: new Date(Date.now() - 1),
      },
    });

    // return response
    return NextResponse.json({
      message: "User verified successfully, you can login now...",
      user: {
        id: updateUser.id,
        email: updateUser.email,
        name: updateUser.name,
        verified: updateUser.verified,
      },
    });
  } catch (err) {
    console.error("Error in OTP verification:", err);
    return NextResponse.json(
      { message: "Internal Server Error, please try again later..." },
      { status: 500 }
    );
  }
}
