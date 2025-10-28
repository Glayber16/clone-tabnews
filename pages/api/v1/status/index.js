import database from "infra/database";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const maxConnections = await database.query("SHOW max_connections;");
  const versionDb = await database.query("SHOW server_version;");
  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: versionDb.rows[0].server_version,
        max_connections: parseInt(maxConnections.rows[0].max_connections),
        using_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}
export default status;
