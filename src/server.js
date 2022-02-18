import express from 'express';
import bodyParser from 'Body-parser'

import http from 'http';

import { MongoClient } from 'mongodb';

import { fileURLToPath } from 'url'
import path,{ dirname} from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
var app = express()
//MONGO



async function GetMongo(data, action) {

    const uri = "mongodb+srv://ThorStenbaek:Mushroomstar2409@cluster0.ntfef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    
    const client = new MongoClient(uri);

    var result = null; 
    
    

   
    try{
        await client.connect();
        
       if (action==Project_findOneListingByURL)
        {result = await Project_findOneListingByURL(client, data)} 


    
        if (action == Project_UpdateDownvoteListing) {
            console.log("yes this far")
            result = await Project_UpdateDownvoteListing(client, data)
        }

        if (action == Project_UpdateUpvoteListing) {
            result = await Project_UpdateUpvoteListing(client, data)
        }

        if (action == Project_AppendCommentToListing) {
            result = await Project_AppendCommentToListing(client, data)
        }

        if (action == Project_FindAllInCluster) {
            result = await Project_FindAllInCluster(client)
        }
    }
    catch(e) {
        console.error(e);
    }
    finally {
       return result
    }
}


async function PostArticleToMongo(name, title, article, action ='') {

    const uri = "mongodb+srv://ThorStenbaek:Mushroomstar2409@cluster0.ntfef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    
    

    var Posted= null; 
    try {
        await client.connect();
        var Posted = await PostArticle(client,name, title, article)
    }

    catch(e) {
        console.error(e);
    }
    finally {
       await client.close();
        return Posted; 
    }
}

async function PostLoginAttemptToMongo(login, password, action) {
   const uri = "mongodb+srv://ThorStenbaek:Mushroomstar2409@cluster0.ntfef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    
    

    var Posted= null; 
    try {
        await client.connect();
        var Posted = await PostLoginAttempt(client,login, password, action)
    }

    catch(e) {
        console.error(e);
    }
    finally {
       await client.close();
        return Posted; 
    } 
}

GetMongo().catch(console.error);

async function PostFindOneListingByURL(client, data) {
    const uri = "mongodb+srv://ThorStenbaek:Mushroomstar2409@cluster0.ntfef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    
   

    var Posted= null; 
    try {
        await client.connect();
        var Posted = await findOneListingByURL(client,data)
    }

    catch(e) {
        console.error(e);
    }
    finally {
       await client.close();
        return Posted; 
    } 

}

async function Project_findOneListingByURL(client, data) {
    var result; 
    console.log("INCOMING DATA",data)
    const dataURL = data.URL; 
    console.log("URL",data.ThisURL)
    result = await client.db("thorstenbaekcom").collection("projects")
    .findOne({ URL: dataURL })

    if (result) {
        console.log(`Found a listing in the collection with the name 
        '${dataURL}'`)
        console.log(result)
        return result;
    }
    else {
        console.log(`No listings found with the URL '${dataURL}'`)
        return null; 
    }
}

async function Project_UpdateUpvoteListing(client, data) {
    var ListingURL = data.URL;
    var vote = data.vote; 
    vote=Number(vote)
    var result = await client.db("thorstenbaekcom").collection("projects").findOne({ URL: ListingURL })
    console.log("in func", result.upvotes)
    var NewUpvote = result.upvotes + vote;
    console.log("new", NewUpvote)
    console.log("resuklt vote", result.upvotes)
    var CurrentUpvotes = {  URL: ListingURL ,upvotes: result.upvotes };
    var newvalues = {
        $set: {
             URL: ListingURL,
            upvotes: NewUpvote
        }
    };

    result = await client.db("thorstenbaekcom").collection("projects").updateOne(CurrentUpvotes, newvalues)
    if (result.acknowledged == true) {
        
        console.log(`New Upvote added: ${NewUpvote}`)
        return `New Upvote added: ${NewUpvote}`;
    }
    else {
        console.log("Something went wrong while updating the database.")
        return "Something went wrong while updating the upvote count."
    }
}

async function Project_UpdateDownvoteListing(client, data)  {
   var ListingURL = data.URL;
    var vote = data.vote; 
    vote=Number(vote)
    var result = await client.db("thorstenbaekcom").collection("projects").findOne({ URL: ListingURL })
    console.log("in func", result.upvotes)
    var NewUpvote = result.upvotes - vote;
    console.log("new", NewUpvote)
    console.log("resuklt vote", result.upvotes)
    var CurrentUpvotes = {  URL: ListingURL ,upvotes: result.upvotes };
    var newvalues = {
        $set: {
             URL: ListingURL,
            upvotes: NewUpvote
        }
    };

    result = await client.db("thorstenbaekcom").collection("projects").updateOne(CurrentUpvotes, newvalues)
    if (result.acknowledged == true) {
        
        console.log(`New Downvote added: ${NewUpvote}`)
        return `New Downvote added: ${NewUpvote}`;
    }
    else {
        console.log("Something went wrong while updating the database.")
        return "Something went wrong while updating the upvote count."
    }
}


async function Project_AppendCommentToListing(client, data) {
    var ListingURL = data.URL; 
    var result = await client.db("thorstenbaekcom").collection("projects").findOne({ URL: ListingURL })
     console.log('yo', result)
    var Currentcomments = { URL: ListingURL, comments: result.comments };
   
    var Newcomments = data.comments; 
    var NewDatacomments = {
        $push: {
           
            comments: Newcomments
        }
    };
    console.log(Currentcomments);
    console.log(Newcomments);
    result = await client.db("thorstenbaekcom").collection("projects").updateOne(Currentcomments, NewDatacomments)
    if (result.acknowledged ==true){
        console.log(`New comment added: username: "${comment.username}" comment: "${comment.comment}"`)
        return `New comment added: username: "${comment.username}" comment: "${comment.comment}"`
    }
    else {
        console.log("Something went wrong while updating the database.")
        return "Something went wrong while updating the the comments."
    }
}

async function Project_FindAllInCluster(client) {
    var result =[]
    result= await client.db("thorstenbaekcom").collection("projects").find({}).toArray()
       
        console.log(result)
        return result
    
}



async function PostArticle(client,nameURL, Article_title, article) {
    
    var NewArticle = {
        name: nameURL, 
        title: Article_title,
        content: article, 
        comments: [],
        upvotes: 0
}

    var result = await client.db("LinkedInLearning").collection("LinkedIn").insertOne(
            {
            name: nameURL, 
            title: Article_title,
            content: article, 
            comments: [],
            upvotes: 0
            }
    )
    
    if (result) {
        return "succes"
    }
    else { return "fail"}
}

async function PostLoginAttempt(client, loginAttempt, passwordAttempt, action) {
    console.log("Attempting to login with login: ", loginAttempt, "and password:", passwordAttempt,)
    result = await client.db("UsernamesAndPasswords").collection("Logins").findOne({ login: loginAttempt})
    console.log(result)
    if (result) {
        return(true)
    }
    else{return(false)}
    
}

async function PostProject(data) {
    
    const uri = "mongodb+srv://ThorStenbaek:Mushroomstar2409@cluster0.ntfef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri);
    var result = null; 
    try{
        await client.connect();
        console.log(data.URL)
        
        if (eval(data.action)==PostProject)
        {result = await PostProjectToMongo(client, data)}

    }
    catch(e) {
        console.error(e);
    }
    finally {
       await client.close();
        return result; 
    }
}
async function PostProjectToMongo(client,data)
{
    data.comments = [];
    data.upvotes = 0;
    var result = await client.db("thorstenbaekcom").collection("projects").insertOne(
    data

    )
    return "Succesfully Posted your New Project"
}


//MONGO




app.use(express.static(path.join(__dirname, '/build')))


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.use(bodyParser.json());



app.post('/postProject', async (req, res) => {
   
    const data = req.body; 

    console.log(data)
    
    const PostResult=  await PostProject(data);
    console.log("post-result: ",PostResult)
    res.status(200).send({  PostResult });
})

app.post('/comment', async (req, res) => {
   
    const data = req.body; 
   
    var action = req.body.action;

    action=eval(action)
    console.log(data)
    
    const PostResult=  await GetMongo(data, action);
    //console.log("post-result: ",PostResult)
    res.status(200).send({  PostResult });
})

app.post('/findoneproject', async (req, res) => {
   
    const data = req.body; 
   
    const action = Project_findOneListingByURL
    
    console.log(data)
    
    const PostResult=  await GetMongo(data, action);
    console.log("post-result: ",PostResult)
    res.status(200).send({  PostResult });
})
app.post('/login', async (req, res) => {
    const login = req.body.login; 
    const password = req.body.password; 
    const action = req.body.action; 
    
    
    const PostResult=  await PostLoginAttemptToMongo(login, password, action);
    console.log("login-result: ",PostResult)
    res.status(200).send({  PostResult });
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'))
})

app.listen(8000, () => console.log("Listening on port 8000"))