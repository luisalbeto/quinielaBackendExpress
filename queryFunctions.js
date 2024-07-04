const { db } = require('./mysqlConnection');

// Función para ejecutar una consulta
const query = async (sql) => {
  console.log(sql)
    return new Promise((resolve, reject) => {
      try {
        db.query({
          sql,
          // ... other options
        },
        (err, rows, fields) => {
          if (err instanceof Error) {
            reject(err);
          }
      
          resolve(rows)
        })

      } catch (error) {
        console.log(error)
        resolve(new Error(`Error executing query: ${error}`));
      }
    })

};

module.exports = {
  query
};