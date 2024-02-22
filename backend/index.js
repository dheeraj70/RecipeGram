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


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass123',
    database: 'subscribe',
  });
  
  db.connect((err) => {
    if (err) {
      console.error('Database connection failed:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

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
  var res = await db.promise().query('SELECT post_title,post_cont FROM subscribe.posts where post_id = ?',[post_id]);
  //console.log(res[0])
  //delete(res[0][0]['post_id'])
  //res = JSON.parse(res[0][0])
  //console.log(JSON.parse(res[0][0]));
  return(res[0][0])
}
const getUserDetails=async(user_id)=>{
  try {
    // Step 1: Retrieve username from the users table
    const [userRows] = await db.promise().query('SELECT username FROM subscribe.users WHERE id = ?', [user_id]);
    const username = userRows.length > 0 ? userRows[0].username : null;

    // Step 2: Retrieve the number of posts from the user_posts table
    const [postsRows] = await db.promise().query('SELECT posts FROM subscribe.user_posts WHERE id = ?', [user_id]);
    const postsCount = postsRows.length > 0 ? JSON.parse(postsRows[0].posts).length : 0;

    // Step 3: Retrieve additional details from the user_details table if user_id is present
    const [detailsRows] = await db.promise().query('SELECT iglink, ytlink, lilink, twlink FROM subscribe.user_details WHERE id = ?', [user_id]);
    const { iglink, ytlink, lilink, twlink } = detailsRows.length > 0 ? detailsRows[0] : {};

    // Construct the JSON object with retrieved data
    const userDetails = {
        username: username,
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
db.query(`INSERT INTO subscribe.posts (post_cont, post_title, thumbURL) VALUES (?, ?, ?)`, [cont.content, cont.title, cont.thumb], (error, results, fields) => {
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
      db.query('INSERT INTO subscribe.user_posts (id, posts) VALUES (?, ?)', [user_id, JSON.stringify([postId])], (error, results, fields) => {
        if (error) {
          console.error('Error inserting new row: ', error);
          return;
        }
        console.log('New row inserted into user_posts.');
      });
    } else {
      // If user exists, update the row by appending the new post_id
      const currentPosts = JSON.parse(results[0].posts);
      currentPosts.push(postId);
      db.query('UPDATE subscribe.user_posts SET posts = ? WHERE id = ?', [JSON.stringify(currentPosts), user_id], (error, results, fields) => {
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

app.get('/user-posts',isAuthenticated,async (req,res)=>{
    const user = req.session.passport.user.id;

    var posts =await db.promise().query('SELECT * FROM subscribe.user_posts where id = ?',[user])
    posts = (posts[0][0] === undefined)?([]):(JSON.parse(posts[0][0].posts));

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
app.get('/userdesc', async(req,res)=>{
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



app.get('/chefs/:chefId', async(req,res)=>{
  var userData = await getUserDetails(req.params.chefId);
  res.send(userData);
});
app.get('/chef-posts/:chefId',async (req,res)=>{
  const user = req.params.chefId;

  var posts =await db.promise().query('SELECT * FROM subscribe.user_posts where id = ?',[user])
  posts = (posts[0][0] === undefined)?([]):(JSON.parse(posts[0][0].posts));
  console.log(posts);
  var posts_res = [];
  for(var i of posts){
    var dat= await getPostMetadata(i);
    posts_res.push(dat);
  }
res.send(posts_res);

})


app.get('/topchefs', (req, res) => {
  const sql = 'SELECT id, username FROM users';

  // Execute the query
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the results as the response
    res.json(results);
  });
});

app.get('/subscriptions', (req, res) => {
  const userId = req.session.passport.user.id;

  const sql = `
    SELECT subscriptions.subscribed_to_id as id, users.username
    FROM subscriptions
    INNER JOIN users ON subscriptions.subscribed_to_id = users.id
    WHERE subscriptions.subscriber_id = ?
  `;
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error retrieving subscribers:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    
    res.json(results);
  });
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