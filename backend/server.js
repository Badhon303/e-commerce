import path from "path"
import express from "express"
import morgan from "morgan" //HTTP request logger middleware
import dotenv from "dotenv"
import mongoDB from "./config/db.js"
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"

dotenv.config()
mongoDB()
const app = express()

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev")) // combined, common, dev, short, tiny
}

app.use(express.json()) // express.json() is a built in middleware function in Express. It parses incoming JSON requests and puts the parsed data in req.body for POST and PUT request.

app.use("/api/products", productRoutes) // app.use Run this on ALL requests GET, PUT, POST, DELETE
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")))
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  )
} else {
  app.get("/", (req, res) => {
    res.send("API is running...")
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
