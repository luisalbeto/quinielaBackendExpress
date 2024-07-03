const { db } = require('./mysqlConnection');

// Función para ejecutar una consulta
const query = async (sql, params) => {
  try {
    const [results, fields] = await db.execute(sql, params);
    return results;
  } catch (error) {
    throw new Error(`Error executing query: ${error}`);
  }
};

module.exports = {
  query
};