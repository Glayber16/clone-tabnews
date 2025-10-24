import database from "infra/database.js";

async function status(request, response) {
  response.status(200).json({ chave: "valor" });
  const result = await database.query("SELECT 1 + 1 as RESULT;");
  console.log(result.rows);
}
export default status;
