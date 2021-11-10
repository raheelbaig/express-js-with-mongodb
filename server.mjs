import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://raheel:baig8911@cluster0.bmry1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
const User = mongoose.model('User', {
    name: String,
    email: String,
    pass: String
})

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    console.log("a request came", req.body);
    next()
})

// GET Request
app.get("/users", (req, res) => {

    User.find({}, (err, users) => {
        if (!err) {
            res.send(users)
        } else {
            res.send(500).send("some error here")
        }
    })
})

app.get('/user/:id', (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (!err) {
            res.send(user)
        } else {
            res.status(500).send("some error here")
        }
    })
})
// -----------------------------------

// POST Request
app.post("/users", (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.pass) {
        res.status(400).send("Invalid data")
    } else {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            pass: req.body.pass
        })
        newUser.save().then(() => {
            console.log("user created successfull");
            res.send("user created")
        })
    }
})
// -----------------------------------

// PUT Request
app.put("/user/:id", (req, res) => {

    let userObj = {}

    if (req.body.name) {
        userObj.name = req.body.name
    }
    if (req.body.email) {
        userObj.email = req.body.email
    }
    if (req.body.pass) {
        userObj.pass = req.body.pass
    }

    User.findByIdAndUpdate(req.params.id, userObj, { new: true },
        (err, data) => {
            if (!err) {
                res.send(data)
            } else {
                res.status(500).send("some error here")
            }
        })
})
// -----------------------------------

app.delete("/user/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id, (err, data) => {
        if (!err) {
            res.send(data)
        } else {
            res.status(500).send("some error here")
        }
    })

})

app.get('/home', (req, res) => {
    res.send("Home page is here :)")
})

app.get('/', (req, res) => {
    res.send("hey, this is server program")
})


app.listen(port, (req, res) => {
    console.log(`http://localhost:${port}`);
})