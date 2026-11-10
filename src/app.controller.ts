import express ,{Request , Response} from "express"
import authRouter from "./module/auth/auth.controller"
import cors from "cors"
import helmet from "helmet" 
import { generalRateLimit } from "./common/middleware/rateLimit/rateLimit"
import { env } from "./config/env.service"
import { connectDB } from "./database/connectionMongo"
import { connectRS } from "./database/connenctionRedius"
import { globalErrorHandler } from "./common/middleware/errorhandling/globalHandler"
import { compareWord, hashWord } from "./common/middleware/security/HashWord"
import userRouter from "./module/user/user.controller"
import friendRouter from "./module/friend/friend.controller"
import commentRouter from "./module/comment/comment.controller"
import postRouter from "./module/post/post.controller"

const bootstrap = async ()=>{
  const app = express()
  app.use(cors({
    origin:"http://localhost:4200"
  }))
app.use(generalRateLimit)
app.use(helmet())
await connectDB()
await connectRS()
  app.use(express.json())
  app.use("/auth",authRouter)
  app.use("/user",userRouter)
  app.use("/friend",friendRouter)
  app.use("/comment",commentRouter)
  app.use("/post",postRouter)
  app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });
  app.use(globalErrorHandler)
  app.listen(env.port,()=>{
    console.log("server is running")
  })
}

export default bootstrap