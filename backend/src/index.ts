import dotenv from "dotenv";
import { createServer } from "./server";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = createServer();

server.listen(PORT, () => {
  console.log(`Server listining on http://localhost:${PORT}`);
});
