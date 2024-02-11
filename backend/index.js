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


    res.status(200).json({ 'message': 'Post uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 'message': 'Server Error' });
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