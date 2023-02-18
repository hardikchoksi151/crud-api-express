const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const router = express.Router()
const app = express()
const port = 8080

// middleware
app.use(bodyParser.json())

// routes
app.route('/api/users')
    .get((req, res) => {

        if (!fs.existsSync('db.json')) {
            return res.status(400).json({ message: "There are no users in database" })
        }

        fs.readFile('db.json', 'utf8', function (err, data) {
            if (err)
                return res.status(500).json(err);

            if (data == '')
                return res.status(400).json({ message: "There are no users in database" })

            return res.send(data)
        });
    })
    .post((req, res) => {
        const user = req.body;
        let users = [];

        if (!fs.existsSync('db.json')) {
            users.push(req.body);

            try {
                fs.writeFileSync('db.json', JSON.stringify(users))
                return res.json({ success: "User successfully added!" });
            } catch (error) {
                return res.json({ error })
            }
        }

        fs.readFile('db.json', 'utf8', function (err, data) {
            if (err) return res.status(500).json(err);

            if (data == '') {
                users.push(req.body);

                try {
                    fs.writeFileSync('db.json', JSON.stringify(users))
                    return res.json({ success: "User successfully added!" });
                } catch (error) {
                    return res.status(500).json({ error })
                }
            }

            users = JSON.parse(data);

            var flag = false;

            users.forEach((t) => {
                if (t.id == req.body.id) {
                    flag = true;
                }
            })

            if (flag) {
                return res.status(400).json({ message: "User with same ID already exists in database." });
            }

            users.push(req.body);

            try {
                fs.writeFileSync('db.json', JSON.stringify(users))
                return res.json({ success: "User successfully added!" });
            } catch (error) {
                return res.status(500).json({ error })
            }
        });
    })

app.route('/api/users/:id')
    .get((req, res) => {
        var result;
        let users = [];
        const id = parseInt(req.params.id);

        if (!fs.existsSync('db.json')) {
            return res.status(400).json({ message: "There are no users in database" })
        }

        fs.readFile('db.json', 'utf8', function (err, data) {
            if (err)
                return res.status(500).json(err);

            if (data == '')
                return res.status(400).json({ message: "There are no users in database" })

            users = JSON.parse(data);

            users.forEach((user) => {
                if (id == user.id) {
                    result = user;
                }
            })

            if (result == undefined) {
                res.status(400).json({ message: "User does not exists" })
            } else {
                res.json(result)
            }
        });

    })
    .put((req, res) => {
        const { name, password, gender, birthdate, age, country, phone } = req.body;
        let users = [];
        const id = parseInt(req.params.id);

        if (!fs.existsSync('db.json')) {
            return res.status(400).json({ message: "There are no users in database" })
        }

        fs.readFile('db.json', 'utf8', function (err, data) {
            if (err)
                return res.status(500).json(err);

            if (data == '')
                return res.status(400).json({ message: "There are no users in database" })

            users = JSON.parse(data);

            var flag = false;
            users.forEach((user) => {
                if (id == user.id) {
                    flag = true;
                    user.name = name == undefined ? user.name : name;
                    user.password = password == undefined ? user.password : password;
                    user.gender = gender == undefined ? user.gender : gender;
                    user.birthdate = birthdate == undefined ? user.birthdate : birthdate;
                    user.age = age == undefined ? user.age : age;
                    user.country = country == undefined ? user.country : country;
                    user.phone = phone == undefined ? user.phone : phone;
                }
            })

            if (!flag)
                return res.status(400).json({ message: "User does not exist in database" });

            try {
                fs.writeFileSync('db.json', JSON.stringify(users))
                return res.json({ success: "User successfully updated!" });
            } catch (error) {
                return res.json({ error })
            }
        });
    })
    .delete((req, res) => {
        var result;
        let users = [];
        const id = parseInt(req.params.id);

        if (!fs.existsSync('db.json')) {
            return res.status(400).json({ message: "There are no users in database" })
        }

        fs.readFile('db.json', 'utf8', function (err, data) {
            if (err)
                return res.status(500).json(err);

            if (data == '')
                return res.status(400).json({ message: "There are no users in database" })

            users = JSON.parse(data);

            users.forEach((user) => {
                if (id == user.id) {
                    result = user;
                }
            })

            if (result == undefined) {
                res.status(400).json({ message: "User does not exists" })
            } else {
                let temp = users.filter((user) => {
                    return id != user.id;
                })

                console.log(temp);

                try {
                    fs.writeFileSync('db.json', JSON.stringify(temp))
                    return res.json({ success: "User successfully deleted!" });
                } catch (error) {
                    return res.json({ error })
                }
            }
        });
    })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})