import { Pool } from "pg"

const pool = new Pool({
  user: "postgres",          
  host: "localhost",         
  database: "miniblog",      
  password: "123456",  
  port: 5432,                
})

export default pool

// import knex from "knex";

// const db = knex({
// client: "pg",
// connection:{

//   user: "postgres",          
//   host: "localhost",         
//   database: "miniblog",      
//   password: "123456",    
// },            
// });

// export default db;

