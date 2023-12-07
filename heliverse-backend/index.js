import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import  {use}  from './data/users.js';
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
mongoose.connect(process.env.MONGO_URL, {
})
.then(()=> console.log("Mongo connected"))
.catch(err=> {
     console.log("Mongo connection error")
     console.log(err)
})






// Define the User schema
const userSchema = new mongoose.Schema({
  id: Number,
  first_name: String,
  last_name: String,
  email: String,
  gender: String,
  avatar: String,
  domain: String,
  available: Boolean,
});

const User = mongoose.model('User', userSchema);


app.use(bodyParser.json());
app.use(cors());

// User.insertMany(use);
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const startIndex = (page - 1) * pageSize;

  let filterCriteria = {};

  // Apply filters if provided in the query parameters
  if (req.query.domain) {
    filterCriteria.domain = req.query.domain;
  }

  if (req.query.gender) {
    filterCriteria.gender = req.query.gender;
  }

  if (req.query.available !== undefined) {
    filterCriteria.available = req.query.available === 'true';
  }

  try {
    const totalUsers = await User.countDocuments(filterCriteria);
    const paginatedUsers = await User.find(filterCriteria).skip(startIndex).limit(pageSize);

    res.json({
      data: paginatedUsers,
      page,
      pageSize,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/users
// app.get('/api/users', async (req, res) => {
//     // const page = parseInt(req.query.page) || 1;
//     // const pageSize = parseInt(req.query.pageSize) || 10;
//     // const startIndex = (page - 1) * pageSize;
//     User.find()
//     .then(users=> res.json(users))
//     .catch(err=> res.json(err))
//   });
  
   

// GET /api/users/:id
// app.get('/api/users/:id', async (req, res) => {
//   const userId = req.params.id;

//   try {
//     const user = await User.findById(userId);

//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// POST /api/users
app.post('/api/users', async (req, res) => {
  const newUser = req.body;

  try {
    const createdUser = await User.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
});

// PUT /api/users/:id
app.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body; // Assuming you send the updated user data in the request body

  try {
    // Find the user by ID and update the data
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true, // Return the updated user
      runValidators: true, // Run validators to ensure data integrity
    });

    if (!updatedUser) {
      // If the user is not found, return a 404 status
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// DELETE /api/users/:id
// Example backend code
app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      console.error(`User with ID ${userId} not found.`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`User with ID ${userId} deleted successfully.`);
    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
