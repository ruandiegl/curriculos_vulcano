import express from "express"
import { router }  from "./routes.js";

const app = express()
const port = process.env.PORT || 3001;

app.use(express.json())

app.use(router)


app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})