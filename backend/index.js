import express from "express";
import cors from "cors";
import connectDB from "./db/index.js";


// Connect to MongoDB
connectDB();

const app = express();


app.use(cors({
    // origin: "http://localhost:5173",
    origin:"https://craftmyplate-ui.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

import userRoute from "./routers/user.routes.js";
import orderRoute from "./routers/order.routes.js";
import menuRoute from "./routers/menu.routes.js";

app.use('/user', userRoute);
app.use('/order', orderRoute);
app.use('/menu', menuRoute);




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
