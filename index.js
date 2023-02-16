import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Aaron123",
  database: "auth_schema",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");
});

// app.get("/passwords", (req, res) => {
//   connection.query("SELECT password FROM password_table", (err, results) => {
//     if (err) throw err;

//     console.log(
//       "Passwords:",
//       results.map((result) => result.password)
//     );

//     res.send("Passwords retrieved");
//   });
// });

// app.post("/password", (req, res) => {
//   const password = req.body.password;

//   connection.query(
//     "SELECT * FROM password_table WHERE password = ?",
//     [password],
//     (err, results) => {
//       if (err) throw err;

//       if (results.length > 0) {
//         res.send("Password found in the database");
//       } else {
//         res.send("Password not found in the database");
//       }
//     }
//   );
// });

app.post("/verify", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query(
    "SELECT * FROM password_table WHERE password = ? AND username = ?",
    [password, username],
    (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        res.send("Login Successful");
      } else {
        res.send("Username and Password not found !");
      }
    }
  );
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query(
    "INSERT INTO password_table (password, username) VALUES (?, ?)",
    [password, username],
    (err, results) => {
      if (err) throw err;

      res.send("Username and Password added to the database");
    }
  );
});

app.get("/canteen1", (req, res) => {
  connection.query("SELECT item , price FROM canteen1", (err, results) => {
    if (err) throw err;

    // console.log(
    //   "Item:",
    //   results.map((result) => result.item)
    // );

    res.send(
      results.map((result) => ({ item: result.item, price: result.price }))
    );
  });
});

app.post("/canteen", (req, res) => {
  const { items, totalPrice } = req.body;
  const values = items
    .map(
      (item) =>
        `('Canteen 1', '${JSON.stringify([
          { item: item.item, quantity: item.quantity,},
        ])}')`
    )
    .join(", ");
  const sql = `INSERT INTO canteen (canteen_number, orders) VALUES ${values};`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error inserting items into canteen table");
    } else {
      console.log(`Inserted ${items.length} items into canteen table`);
      res.send(`Items inserted into canteen table. Total price: ${totalPrice}`);
    }
  });
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
