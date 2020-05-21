async function insertUser(client, name, password) {
  return new Promise((resolve, reject) => {
    client.query(
      `INSERT INTO User(email,password) VALUES('${name}','${password}');`,
      function (error, result, fields) {
        if (error) {
          reject(error);
        }

        resolve({ result, fields });
      }
    );
  });
}

async function findUser(client, name) {
  return new Promise((resolve, reject) => {
    client.query(`SELECT * FROM User WHERE email='${name}' LIMIT 1`, function (
      error,
      result,
      fields
    ) {
      if (error) {
        reject(error);
      }

      resolve({ result, fields });
    });
  });
}

async function getAllUsers(client) {
  return new Promise((resolve, reject) => {
    client.query(`SELECT * FROM User`, function (
      error,
      result,
      fields
    ) {
      if (error) {
        reject(error);
      }

      resolve({ result, fields });
    });
  });
}

module.exports = { insertUser, findUser, getAllUsers };
