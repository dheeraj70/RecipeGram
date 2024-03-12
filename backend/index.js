const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const { Strategy } =require('passport-local');
const cors = require('cors')
const store = new session.MemoryStore();
const path = require('path');
const { off } = require('process');

const app = express();
const port = 8080;
const saltRounds = 10;

const corsOptions = {
  origin: 'http://localhost:3000', // Specify the allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Specify the allowed HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204, // HTTP status code for successful preflight requests
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('static'));
app.use(session({
  secret:"UDEMY",
  resave:false,
  saveUninitialized: true,
  store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 
  }
})
);
app.use(passport.initialize());
app.use(passport.session());


const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pass123',
  database: 'subscribe',
  waitForConnections: true,
  connectionLimit: 50, 
  queueLimit: 0
  });
  /*
  db.connect((err) => {
    if (err) {
      console.error('Database connection failed:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });
*/
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() +path.extname(file.originalname))
    }
  });
  
  const upload = multer({ storage: storage });
  
  app.use(express.static('uploads'));
/*
app.get('/',(req,res)=>{
    res.send('/view/');
})

app.get('/login',(req,res)=>{
    res.sendFile(__dirname + '/view/login.html');
})

app.get('/register',(req,res)=>{
    res.sendFile(__dirname + '/view/register.html');
})
*/


//Middlewares
const isAuthenticated = (req,res,next)=>{
  if(req.isAuthenticated()){
    next();
  }else{
    res.status(401).json({message: "Not authorised"});
  }
  
}


//Other functions
const getPostMetadata=async(post_id)=>{
  var res = await db.promise().query('SELECT post_id,post_title,thumbURL FROM subscribe.posts where post_id = ?',[post_id]);
  //console.log(res[0])
  //delete(res[0][0]['post_id'])
  //res = JSON.parse(res[0][0])
  //console.log(JSON.parse(res[0][0]));
  return(res[0][0])
}
const getPostdata=async(post_id)=>{
  var res = await db.promise().query('SELECT post_title,post_cont,date_time FROM subscribe.posts where post_id = ?',[post_id]);
  //console.log(res[0])
  //delete(res[0][0]['post_id'])
  //res = JSON.parse(res[0][0])
  //console.log(JSON.parse(res[0][0]));
  return(res[0][0])
}
const getUserDetails=async(user_id)=>{
  try {
    
    const [userRows] = await db.promise().query('SELECT username FROM subscribe.users WHERE id = ?', [user_id]);
    const username = userRows.length > 0 ? userRows[0].username : null;

    
    const [postsRows] = await db.promise().query('SELECT posts FROM subscribe.user_posts WHERE id = ?', [user_id]);
    const postsCount = postsRows.length > 0 ? postsRows[0].posts.length : 0;

    
    const [detailsRows] = await db.promise().query('SELECT iglink, ytlink, lilink, twlink FROM subscribe.user_details WHERE id = ?', [user_id]);
    const { iglink, ytlink, lilink, twlink } = detailsRows.length > 0 ? detailsRows[0] : {};

    const [subCountRows] = await db.promise().query('SELECT COUNT(subscriber_id) AS subcount FROM subscriptions WHERE subscribed_to_id = ?;', [user_id]);
    const subCount = JSON.parse(subCountRows[0].subcount);
    // Construct the JSON object with retrieved data

    const userDetails = {
        username: username,
        subCount: subCount,
        postsCount: postsCount,
        iglink: iglink,
        ytlink: ytlink,
        lilink: lilink,
        twlink: twlink
    };

    return(userDetails);
} catch (error) {
    console.error('Error retrieving user details:', error);
    throw error;
}
}
//getPostdata(3);



//Routes

app.get('/',isAuthenticated,(req,res)=>{
  
    res.status(200).json({ message: "Everything is good, youu"+req.user.username , userr: req.session.passport.user });
  
})

app.post('/register',async (req,res)=>{
    const user = req.body.username;
    const pass = req.body.password;
    try {
        const [rows, fields]= await db.promise().query('SELECT * FROM subscribe.users WHERE username = ?',[user]);
        if(rows.length > 0){
            res.status(400).json({ message: 'User already exists' });
        }else{

          //pass hashing using bcrypt
          bcrypt.hash(pass, saltRounds, async (err,hash)=>{
            if(err){
              console.log(err);
            }else{
            const [insertResult, insertFields] = await db.promise().query('INSERT INTO subscribe.users (username, password) VALUES (?, ?)', [user, hash]);
            console.log('User registered:', insertResult);
            res.status(200).json({ message: 'User registered successfully' });
            }
          })
            
        }
    } catch (error) {
        console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    }

    //console.log(req.body)
})

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err,user) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ message: err });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      console.log(store);
      return res.status(200).json({ message: 'Login successful', user: user });
      
    });
  })(req, res, next);
});

  
app.delete("/logout", (req, res)=>{
  
   /* req.session.destroy((err)=>{
      res.clearCookie('connect.sid');
      res.status(200).json({message:"Out"});
    });
    */
   req.logOut((err)=>{
    res.clearCookie('connect.sid');
      res.status(200).json({message:"Out"});
      if(err){
        console.log(err);
      }
    
   })
    console.log(store);
  
  
})


app.post('/upload-image', isAuthenticated,upload.single('image'), (req, res) => {
  // Multer has saved the image to the 'uploads' directory
  // You can access the uploaded file via req.file
  // In this example, we'll simply return the URL of the uploaded image
  console.log(req.file);
  const imageUrl = `http://localhost:${port}/${req.file.filename}`;
  res.send(imageUrl);
});

app.post('/upload-post', isAuthenticated, async (req, res) => {
  try {
    //console.log('yes')
    const cont = req.body;
    const user_id = req.session.passport.user.id;
    /*
    // Check if the user_id exists in the database
    const [rows, fields] = await db.promise().query('SELECT * FROM subscribe.posts WHERE user_id = ?', [user_id]);
    
    if (rows.length === 0) {
      // If user_id not present, add a new row for the user
      await db.promise().query('INSERT INTO subscribe.posts (user_id, post_text) VALUES (?, ?)', [user_id, JSON.stringify([cont])]);
    } else {
      // If user_id already present, fetch existing post_text and prepend new content
      const [userData] = rows;
      const existingPosts = JSON.parse(userData.post_text);
      existingPosts.unshift(cont);
      // Update the existing row with the updated post_text
      await db.promise().query('UPDATE subscribe.posts SET post_text = ? WHERE user_id = ?', [JSON.stringify(existingPosts), user_id]);
    }

*/




// Execute the SQL query to insert a new post
db.query(`INSERT INTO subscribe.posts (post_cont, post_title, thumbURL, date_time) VALUES (?, ?, ?, NOW())`, [cont.content, cont.title, cont.thumb], (error, results, fields) => {
  if (error) {
    console.error('Error inserting new post: ', error);
    return;
  }
  console.log('New post created successfully.');

  // Get the generated post_id
  const postId = results.insertId;
  console.log(postId);

  // Check if the user exists in the user_posts table
  db.query('SELECT * FROM subscribe.user_posts WHERE id = ?', [user_id], (error, results, fields) => {
    if (error) {
      console.error('Error checking if user exists: ', error);
      return;
    }

    // If user doesn't exist, insert a new row
    if (results.length === 0) {
      db.query('INSERT INTO subscribe.user_posts (id, posts) VALUES (?, CAST(? AS JSON))', [user_id, JSON.stringify([postId])], (error, results, fields) => {
        if (error) {
          console.error('Error inserting new row: ', error);
          return;
        }
        console.log('New row inserted into user_posts.');
      });
    } else {
      // If user exists, update the row by appending the new post_id
      /*const currentPosts = JSON.parse(results[0].posts);
      currentPosts.push(postId);*/
      db.query("UPDATE subscribe.user_posts SET posts = JSON_ARRAY_APPEND(posts, '$', ?) WHERE id = ?", [postId, user_id], (error, results, fields) => {
        if (error) {
          console.error('Error updating row: ', error);
          return;
        }
        console.log('Row updated in user_posts.');
      });
    }
  });
});


    res.status(200).json({ 'message': 'Post uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 'message': 'Server Error' });
  }
});

app.get('/user-posts/:page',isAuthenticated,async (req,res)=>{
    const user = req.session.passport.user.id;
    const page = parseInt(req.params.page); // Extract page number from URL parameter

  // Define how many posts to fetch per page
  const postsPerPage = 5;

    // Calculate the offset based on the page number
  const offset = (page - 1) * postsPerPage;

    var posts =await db.promise().query('SELECT posts FROM subscribe.user_posts where id = ?',[user])

    posts = (posts[0][0] === undefined)?([]):(posts[0][0].posts);

    posts = posts.slice(offset, offset+postsPerPage);

    var posts_res = [];
    for(var i of posts){
      var dat= await getPostMetadata(i);
      posts_res.push(dat);
    }
  res.send(posts_res);

})

app.get('/posts/:pId',isAuthenticated, async(req,res)=>{
  var pdat = await getPostdata(req.params.pId);
  res.send(pdat);
});
app.get('/userdesc',isAuthenticated, async(req,res)=>{
  var userData = await getUserDetails(req.session.passport.user.id);
  res.send(userData);
});
app.post('/userdesc',isAuthenticated, (req, res) => {
  const { user_name, iglink, ytlink, lilink, twlink } = req.body;
  const user_id = req.session.passport.user.id;
  // Step 1: Check if the new username already exists in the users table
  db.query('SELECT * FROM users WHERE username = ?', [user_name], (err, results) => {
    if (err) {
      console.error('Error checking username:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0 && results[0].id !== user_id) {
      // If the new username already exists, return status code 403
      
      return res.status(403).send('Username already exists');
    
    } else {
      // If the new username doesn't exist, proceed with updating user details
      // For demonstration purposes, assuming user_id is passed in the request body
      

      // Step 2: Update the username in the users table
    if(user_name !="" || !(user_name)){  db.query('UPDATE users SET username = ? WHERE id = ?', [user_name, user_id], (err, result) => {
        if (err) {
          console.error('Error updating username:', err);
          return res.status(500).send('Internal Server Error');
        }
});}
        // Step 3: Check if user_id exists in the user_details table
        db.query('SELECT * FROM user_details WHERE id = ?', [user_id], (err, userDetails) => {
          if (err) {
            console.error('Error checking user details:', err);
            return res.status(500).send('Internal Server Error');
          }
        
          if (userDetails.length === 0) {
            // If user_id doesn't exist, insert new row in user_details table
            db.query('INSERT INTO user_details (id, iglink, ytlink, lilink, twlink) VALUES (?, ?, ?, ?, ?)',
              [user_id, iglink, ytlink, lilink, twlink],
              (err, result) => {
                if (err) {
                  console.error('Error inserting user details:', err);
                  return res.status(500).send('Internal Server Error');
                }
                return res.status(200).send('Profile updated successfully');
              });
          } else {
            // If user_id exists, update existing row in user_details table
            db.query('UPDATE user_details SET iglink = ?, ytlink = ?, lilink = ?, twlink = ? WHERE id = ?',
              [iglink, ytlink, lilink, twlink, user_id],
              (err, result) => {
                if (err) {
                  console.error('Error updating user details:', err);
                  return res.status(500).send('Internal Server Error');
                }
                return res.status(200).send('Profile updated successfully');
              });
          }
        });
      
    }
  });
});

// Backend endpoint to find user ID by post ID
app.get('/user-by-post/:postId',isAuthenticated, (req, res) => {
  const { postId } = req.params;

  // Query the database to find the user ID associated with the given post ID
  const sql = "SELECT id FROM user_posts WHERE JSON_CONTAINS(posts, CAST(? AS JSON))";
  db.query(sql, [postId], (err, results) => {
    if (err) {
      console.error('Error finding user ID by post ID:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'User not found for the given post ID' });
      return;
    }

    const userId = results[0].id;

    // Query the database to fetch the username based on the retrieved user ID
    const userSql = "SELECT username FROM users WHERE id = ?";
    db.query(userSql, [userId], (userErr, userResults) => {
      if (userErr) {
        console.error('Error finding username by user ID:', userErr);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (userResults.length === 0) {
        res.status(404).json({ error: 'Username not found for the given user ID' });
        return;
      }

      const username = userResults[0].username;
      res.json({ userId, username });
    });
  });
});


app.get('/chefs/:chefId',isAuthenticated, async(req,res)=>{
  var userData = await getUserDetails(req.params.chefId);
  res.send(userData);
});
app.get('/chef-posts/:chefId/:page',async (req,res)=>{
  const user = req.params.chefId;
  const page = parseInt(req.params.page); // Extract page number from URL parameter

  // Define how many posts to fetch per page
  const postsPerPage = 5;

    // Calculate the offset based on the page number
  const offset = (page - 1) * postsPerPage;

  var posts =await db.promise().query('SELECT posts FROM subscribe.user_posts where id = ?',[user]);
  posts = (posts[0][0] === undefined)?([]):(posts[0][0].posts);
  posts = posts.slice(offset, offset+postsPerPage)
  //console.log(posts);
  var posts_res = [];
  for(var i of posts){
    var dat= await getPostMetadata(i);
    posts_res.push(dat);
  }
  
res.send(posts_res);

})


app.get('/topchefs/:page', (req, res) => {
  const page = req.params.page;

  const sql = 'SELECT id, username FROM users LIMIT ? OFFSET ?';

// Define how many posts to fetch per page
const postsPerPage = 25;

// Calculate the offset based on the page number
const offset = (page - 1) * postsPerPage;
  
  // Execute the query
  db.query(sql,[postsPerPage,offset], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the results as the response
    res.json(results);
  });
});

app.get('/subscriptions/:page',isAuthenticated, (req, res) => {
  const userId = req.session.passport.user.id;
  const page = req.params.page;


// Define how many posts to fetch per page
const postsPerPage = 25;

// Calculate the offset based on the page number
const offset = (page - 1) * postsPerPage;

  const sql = `
    SELECT subscriptions.subscribed_to_id as id, users.username
    FROM subscriptions
    INNER JOIN users ON subscriptions.subscribed_to_id = users.id
    WHERE subscriptions.subscriber_id = ? LIMIT ? OFFSET ?
  `;
  
  db.query(sql, [userId,postsPerPage, offset], (err, results) => {
    if (err) {
      console.error('Error retrieving subscribers:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    
    res.json(results);
  });
});

app.get('/subscriptionStatus/:userId',isAuthenticated, (req, res) => {
  const currentUser = req.session.passport.user.id;
  const subscribedTo = req.params.userId;

if(currentUser == subscribedTo){
  res.json({isSubscribed: "same" });
}else{

//console.log(currentUser == subscribedTo);


  const sql = 'SELECT * FROM subscriptions WHERE subscriber_id = ? AND subscribed_to_id = ?';
  db.query(sql, [currentUser, subscribedTo], (err, results) => {
    if (err) {
      console.error('Error checking subscription status:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const isSubscribed = results.length > 0;
    //console.log( isSubscribed );
    res.json({ isSubscribed });
  });
}
});

app.post('/subscriptions/:userId/:action',isAuthenticated, (req, res) => {
  const currentUser = req.session.passport.user.id;
  const subscribedTo = req.params.userId;
  const action = req.params.action; // 'subscribe' or 'unsubscribe'

  // Perform subscription/unsubscription based on the action
  let sql, message;
  if (action === 'subscribe') {
    sql = 'INSERT INTO subscriptions (subscriber_id, subscribed_to_id) VALUES (?, ?)';
    message = 'Subscription successful';
  } else if (action === 'unsubscribe') {
    sql = 'DELETE FROM subscriptions WHERE subscriber_id = ? AND subscribed_to_id = ?';
    message = 'Unsubscription successful';
  } else {
    res.status(400).json({ error: 'Invalid action' });
    return;
  }

  db.query(sql, [currentUser, subscribedTo], (err) => {
    if (err) {
      console.error('Error updating subscription:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message, isSubscribed: action === 'subscribe' });
  });
});


// Backend endpoint for searching posts by title
app.get('/search',isAuthenticated, (req, res) => {
  const { query } = req.query; // Get the search query from the request

  // Perform a database query to search for posts by title
  const sql = 'SELECT * FROM posts WHERE post_title LIKE ?';
  const searchTerm = `%${query}%`; // Add '%' wildcard to search for partial matches
  db.query(sql, [searchTerm], (err, results) => {
    if (err) {
      console.error('Error searching posts:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results); // Send the search results back to the client
  });
});


app.get('/subscriber-posts',isAuthenticated, async (req, res) => {
  try {
      const subscriberId = req.session.passport.user.id;
      
      // Fetch IDs of users subscribed to by the subscriber
      const subscribedUserIds = await new Promise((resolve, reject) => {
          db.query('SELECT subscribed_to_id FROM subscriptions WHERE subscriber_id = ?', [subscriberId], (err, results) => {
              if (err) {
                  reject(err);
                  return;
              }
              resolve(results.map(result => result.subscribed_to_id));
          });
      });

      // Get the current date and date 5 days ago
      const currentDate = new Date();
      const fiveDaysAgo = new Date(currentDate);
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 7);

      // Fetch posts made by subscribed users in the last 5 days
      
      const posts = await new Promise((resolve, reject) => {
        if(subscribedUserIds.length ===0){
          resolve([]);
        }
          const sql = `
          SELECT p.post_id,p.post_title,p.thumbURL,p.date_time, users.username
          FROM user_posts
          JOIN posts p ON JSON_CONTAINS(user_posts.posts, CAST(p.post_id AS JSON))
          JOIN users ON users.id = user_posts.id
          WHERE user_posts.id IN (?) 
                AND p.date_time >= ?
          ORDER BY p.date_time DESC`;
          db.query(sql, [subscribedUserIds, fiveDaysAgo], (err, results) => {
              if (err) {
                  reject(err);
                  return;
              }
              resolve(results);
          });
      });

      res.json(posts);
  } catch (error) {
      console.error('Error fetching subscriber posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/all-posts/:page', async (req, res) => {
  const page = parseInt(req.params.page); // Extract page number from URL parameter

  // Define how many posts to fetch per page
  const postsPerPage = 5;

  try {
    // Calculate the offset based on the page number
    const offset = (page - 1) * postsPerPage;

    // Query the database to fetch posts for the given page
    const query = `
    SELECT p.post_id,p.post_title,p.thumbURL,p.date_time, u.username
FROM user_posts up
JOIN posts p ON JSON_CONTAINS(up.posts, CAST(p.post_id AS JSON))
JOIN users u ON up.id = u.id
ORDER BY p.date_time DESC
LIMIT ? OFFSET ?
    `;
    const [rows] = await db.promise().query(query, [postsPerPage, offset]);

    // Send the fetched posts as a JSON response
  
    res.json(rows);
  } catch (error) {
    // If there's an error, send a 500 Internal Server Error response
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


passport.use(new Strategy(async function verify(username,password,cb){
    console.log(username)
   // console.log(password)
    try {
    const [rows, fields] = await db.promise().query('SELECT * FROM subscribe.users WHERE username = ?', [username]);
  
    if (rows.length > 0) {
      const user =rows[0];
      const storedHashPass = user.password;

      bcrypt.compare(password, storedHashPass, (err,result)=>{
        if(err){
          console.log(err)
        }else{
          if(result){
            return cb(null, user);
          }else{
            return cb(null, false);
          }
        }
      })

    } else {
      return cb("User not found");
    }
  } catch (error) {
    return cb(error);
  }
  }))

  passport.serializeUser((user,cb)=>{
    cb(null, user);
  })

  passport.deserializeUser((user,cb)=>{
    cb(null, user);
  })

  app.listen(port,()=>{
    console.log(`server started at ${port}`)
  })