import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { ROLE } from "@workspace/utils/constant";

const handleError = (error: unknown, operation: string) => {
  console.error(`Error ${operation}:`, error);
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
};

export const userRouter = createTRPCRouter({
  sendVerificationSms: protectedProcedure
    .input(
      z.object({
        classLevel: z.string(),
        phone: z.string(),
        studentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { classLevel, phone, studentId } = input;
      try {
        const existingSms = await ctx.db.smsVerification.findFirst({
          where: {
            identifier: studentId,
          },
        });

        if (existingSms) {
          return {
            success: false,
            message: "Verification code already sent",
          };
        }

        const student = await ctx.db.student.findFirst({
          where: {
            classNameId: classLevel,
            studentId,
            OR: [{ fPhone: { equals: phone } }, { mPhone: { equals: phone } }],
          },
          include: {
            user: true,
          },
        });

        if (!student) {
          console.log("calling");
          return {
            success: false,
            message: "Student not found",
          };
        }

        if (student.user) {
          return {
            success: false,
            message: "Student already has an account",
          };
        }

        await ctx.db.smsVerification.create({
          data: {
            identifier: `${student.id}/${ctx.user.id}`,
            // value: generateVerificationCode(),
            value: "123456",
            expiresAt: new Date(Date.now() + 60 * 5 * 1000),
          },
        });

        return {
          success: true,
          message: "Verification code sent successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "Failed to send verification code",
        };
      }
    }),

  resendVerificationSms: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const existingSms = await ctx.db.smsVerification.findFirst({
        where: {
          identifier: {
            endsWith: ctx.user.id,
          },
        },
      });

      if (!existingSms) {
        return {
          success: false,
          message: "Verification code not found",
        };
      }

      const student = await ctx.db.student.findFirst({
        where: {
          id: existingSms.identifier.split("/")[0],
        },
      });

      if (!student) {
        return {
          success: false,
          message: "Student not found",
        };
      }

      await ctx.db.smsVerification.create({
        data: {
          identifier: `${student.id}-${ctx.user.id}`,
          // value: generateVerificationCode(),
          value: "123456",
          expiresAt: new Date(Date.now() + 60 * 5 * 1000),
        },
      });

      return {
        success: true,
        message: "Verification code sent successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to send verification code",
      };
    }
  }),

  verifyVerificationSms: protectedProcedure
    .input(
      z.object({
        verificationCode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { verificationCode } = input;
      try {
        const existingSms = await ctx.db.smsVerification.findFirst({
          where: {
            identifier: {
              endsWith: ctx.user.id,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (!existingSms) {
          return {
            success: false,
            message: "Verification code not found",
          };
        }

        if (existingSms.expiresAt < new Date()) {
          return {
            success: false,
            message: "Verification code expired",
          };
        }

        if (existingSms.value !== verificationCode) {
          return {
            success: false,
            message: "Invalid verification code",
          };
        }

        return {
          success: true,
          message: "Verification code verified successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "Failed to verify verification code",
        };
      }
    }),

  assignAccountPhone: protectedProcedure
    .input(
      z.object({
        accountPhone: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { accountPhone } = input;
      try {
        await ctx.db.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            phone: accountPhone,
            isVerifiedStudent: true,
          },
        });

        return {
          success: true,
          message: "User verified successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "Failed to verify user",
        };
      }
    }),

  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          isVerifiedStudent: true,
        },
      });

      const existingSms = await ctx.db.smsVerification.findFirst({
        where: {
          identifier: {
            endsWith: ctx.session.user.id,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!existingSms) {
        return {
          success: false,
          message: "Verification code not found",
        };
      }

      const student = await ctx.db.student.findUnique({
        where: {
          id: existingSms.identifier.split("/")[0],
        },
        include: {
          user: true,
        },
      });

      if (!student) {
        return {
          success: false,
          message: "Student not found",
        };
      }

      if (student.user) {
        return {
          success: false,
          message: "Student already has a user",
        };
      }

      await ctx.db.student.update({
        where: {
          id: student.id,
        },
        data: {
          userId: ctx.session.user.id,
        },
      });

      await ctx.db.smsVerification.deleteMany({
        where: {
          identifier: {
            endsWith: ctx.session.user.id,
          },
        },
      });

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          isVerifiedStudent: true,
          role: ROLE.Student,
        },
      });

      return {
        success: true,
        message: "User verified successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to verify user",
      };
    }
  }),

  getVerifiedUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    return user;
  }),
});
