import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "fail",
          errros: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }

      res.status(500).json({ message: "Internal Server Error" });
    }
  };
