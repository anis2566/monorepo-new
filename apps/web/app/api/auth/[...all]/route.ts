import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@workspace/auth";

export const { POST, GET } = toNextJsHandler(auth);
