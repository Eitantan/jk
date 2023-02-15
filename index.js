// All code is copyirght 2023 Eitan Alperstein. See LICENSE file for license
const express = require('express');
const Database = require("replpersist")
let userbase = new Database("users")
const adjectives = ["smiley", "friendly", "funny", "dark", "gnarled", "tangled", "spiky"]
const nouns = ["giraffe", "bob", "notes", "roots"]
let options = "lol jk is best fr fr"
const NUMBER_LIMIT = 100
const generate = {
	meaningful(opt) {
		// Maybe add support for camel case or variations? idk make it less bland?
		return adjectives[Math.floor(Math.random()*adjectives.length)] + "-" + nouns[Math.floor(Math.random()*nouns.length)] + "-" + Math.floor(Math.random()*100);
	}
}
console.log(generate.meaningful(options))

const app = express();
app.use(express.static("public"))

app.get("/signupmidpoint/:email/:password", (req, res)=>{
	console.log(decodeURIComponent(req.params.email))
	console.log(decodeURIComponent(req.params.password))
	let email = decodeURIComponent(req.params.email)
	let password = decodeURIComponent(req.params.password)
	if (userbase.data[email] !== undefined) {
		res.send("<script>alert('Username taken'); setTimeout(()=>{window.location='jk.anthonymouse.repl.co/signup.html'},2000)</script>")
	} else {
		userbase.data[email] = {"pass": password}
		userbase.data[email].logins = 1
	}
	res.redirect("/app")
})

app.get("/loginmidpoint/:email/:password", (req, res)=>{
	console.log(decodeURIComponent(req.params.email))
	console.log(decodeURIComponent(req.params.password))
	let email = decodeURIComponent(req.params.email)
	let password = decodeURIComponent(req.params.password)
	res.send(JSON.stringify(userbase))
	if (userbase.data[email]["pass"] !== password) {
		res.send("<script>alert('Incorrect creditentials'); setTimeout(()=>{window.location='jk.anthonymouse.repl.co/login.html.html'},2000)</script>")
	} else {
		userbase.data[email].logins += 1
		changenick("f")
		res.redirect("/app")
	}
})

app.get("/app", (req, res)=>{
	res.send(`
 		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>jk | Home</title>
		</head>
		<body>
			<h1>jk</h1>
	 		<a href="/post.html">create post</a>
		</body>
		</html>
 `)
})

function changenick(all) {
	for (each in userbase.data) {
		if (typeof userbase.data[each] == "object") {	
			userbase.data[each].nick == generate.meaningful(options)
		}
	}
}

app.listen(3000, () => {
  console.log('server started');
})