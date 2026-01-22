import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { CustomError } from "@/utils/CustomError";
import { UniqueConstraintError } from "sequelize";

export default function errorHandler(err) {
  console.log("Ups, some error ocurred: ", err);
  const errObj = {
    message: err.message,
    reason: "No adititonal data",
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  };
  //console.log({ parrent: err.parent.sqlMessage });
  if (err instanceof UniqueConstraintError) {
    errObj.message = err?.parent?.code;
    errObj.reason = err?.parent?.sqlMessage;
  }
  if (err instanceof CustomError) {
    errObj.message = err?.message || "Generic error";
    errObj.reason = err?.reason || "No aditional data";
    errObj.statusCode = err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  }
  //console.log({ isZodErr: err instanceof ZodError, iss: err.issues });
  if (err instanceof ZodError) {
    errObj.message = err?.issues?.map(
      (error) => error.message + " Field: " + error.path
    );
    errObj.reason = err?.reason || "No aditional data";
    errObj.statusCode = StatusCodes.BAD_REQUEST;
  }
  return Response.json(
    {
      success: false,
      error: {
        message: errObj.message,
        data: errObj.reason,
      },
    },
    { status: errObj.statusCode }
  );
}
