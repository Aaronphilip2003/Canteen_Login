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

app.get("/canteen2", (req, res) => {
  connection.query("SELECT item , price FROM canteen2", (err, results) => {
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

app.get("/canteen3", (req, res) => {
  connection.query("SELECT item , price FROM canteen3", (err, results) => {
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
  const values = items.map(
    (item) => `('${item.canteen_number}', '${item.item}', 1, ${item.price})`
  );
  const sql = `INSERT INTO canteen (canteen_number, item, quantity, price) VALUES ${values.join(
    ","
  )};`;
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

app.get("/admin1", (req, res) => {
  connection.query(
    `SELECT * from canteen where canteen_number="Canteen 1"`,
    (err, results) => {
      if (err) throw err;

      res.send(
        results.map((result) => ({ item: result.item, price: result.price }))
      );
    }
  );
});

app.post("/admin1/delete", (req, res) => {
  const indices = req.body.indices;
  const query = `DELETE FROM canteen1 WHERE index IN (${indices.join(",")})`;
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.error("Error deleting items from canteen1 table: ", err);
      res.sendStatus(500);
      return;
    }
    console.log(
      `Deleted items with indices ${indices.join(",")} from canteen1 table.`
    );
    res.sendStatus(200);
  });
});

app.delete("/admin1/:index", (req, res) => {
  const index = req.params.index;
  const query = `DELETE FROM canteen1 WHERE index = ${index}`;
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.error("Error deleting item from canteen1 table: ", err);
      res.sendStatus(500);
      return;
    }
    console.log(`Deleted item with index ${index} from canteen1 table.`);
    res.sendStatus(200);
  });
});

app.post("/admin2/delete", (req, res) => {
  const indices = req.body.indices;
  const query = `DELETE FROM canteen2 WHERE index IN (${indices.join(",")})`;
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.error("Error deleting items from canteen2 table: ", err);
      res.sendStatus(500);
      return;
    }
    console.log(
      `Deleted items with indices ${indices.join(",")} from canteen2 table.`
    );
    res.sendStatus(200);
  });
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
