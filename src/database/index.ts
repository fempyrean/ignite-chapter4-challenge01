import { createConnection, getConnectionOptions, Connection } from "typeorm";

export const getConnection = async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();
  return await createConnection(
    Object.assign(defaultOptions, {
      database: process.env.NODE_ENV === "test" ? "fin_api_test" : "fin_api",
    })
  );
};

// (async () => await createConnection())();
