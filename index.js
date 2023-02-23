// All code is copyirght 2023 Eitan Alperstein. See LICENSE file for license
const express = require('express');
const Database = require("replpersist")
let userbase = new Database("users")
const adjectives = ["smiley", "friendly", "funny", "dark", "gnarled", "tangled", "spiky"]
const categories = ["general", "first-community"]
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
		res.send("<script>alert('Incorrect creditentials'); setTimeout(()=>{window.location='jk.anthonymouse.repl.co/login.html'},2000)</script>")
	} else {
		userbase.data[email].logins += 1
		changenick("f")
		res.redirect("/app/" + userbase.data[email])
	}
})

app.get("/app/:yep", (req, res)=>{
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
	 		<p style="color:red">YOUR USER ID IS ${req.params.yep}. REMEMBER THAT!</p>
		<!-- add info page about why you need to remember it -->
	 		<a href="/post">create post</a>
		</body>
		</html>
 `)
})

app.get("/post", (req, res)=>{
	let all_categs = ""
	for (var i = 0; i < categories.length; i++) {
		all_categs += `<a onclick=addCateg(${categories[i]})>#${categories}</a>`
		all_categs += "\n"
	}
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
	 		<form>
				<input id="title" placeholder="Title of Post">
				<textarea id="text" rows="6" cols="65" placeholder="Type in your post here"></textarea>
				<div class="dropdown">
				  <button onclick="myFunction()" class="dropbtn">Dropdown</button>
				  <div id="myDropdown" class="dropdown-content">
				    <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">
							${all_categs}
				  </div>
				</div>
				<p id="categories"></p>
				<input id="userid" placeholder="Your User ID">
				
				<button id="post" onclick="yes()">
			</form>
	 	<script>
	 		function addCateg(name) {
				document.getElementById("categories").value += name + ", "
			}
			function yes() {
	 			window.location = "https://https://jk.anthonymouse.repl.co/postmidpoint/" + document.getElementById("title") + "/" + document.getELementById("text") + "/" + document.getElementById("userid") + "/" + document.getElementById("categories").value
			}

	function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}
 		</script>
		</body>
		</html> 
 `)
})

app.get("/postmidpoint/:title/:text/:userid", (req, res)=>{
	if (userbase.data[req.params.userid].posts == undefined) {
		userbase.data[req.params.userid].posts = {}
	}
	userbase.data[req.params.userid].posts.push({"title":req.params.title,"text":req.params.text,})
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