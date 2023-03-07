require("dotenv").config();

const merge = require('deepmerge');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
var admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ===========================
// BELOW, PLACE YOUR SDK & DATABASE INFO
// ===========================

var serviceAccount = require("./tacoclass-9524b-firebase-adminsdk-qbzwy-5a781eb941.json");
const connection = mysql.createConnection({
	host: 'process.env.DATABASE_HOST',
	user: 'process.env.DATABASE_USER',
	password: 'process.env.DATABASE_PASSWORD',
	database: 'process.env.DATABASE_NAME'
});

// ===========================

const port = process.env.PORT || 8080;
const { initializeApp } = require("firebase-admin/app");
initializeApp({
	credential: admin.credential.cert(serviceAccount)
});
app.listen(port, () => {
	console.log(`listening on *:${port}`);
});
connection.connect((err) => {
	if (err) {
		console.log('error connecting:' + err.stack);
		return;
	}
	console.log('success')
})

// ===========================
// BELOW, APIs ARE IMPLETEMTED
// ===========================

// get private-todos
app.get('/api/todos', async (req, res) => {
	const idToken = req.header("Authorization");
	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);

		var query = "SELECT * FROM todos_private WHERE uid = ? and is_done = 0;";
		query = mysql.format(query, uid);
		connection.query(query, (error, results) => {
			res.json(results);
		})
	}
	else {
		res.json(403).send();
	}

})

// post todos
app.post('/api/todos', async (req, res) => {
	const idToken = req.body.headers.Authorization;
	const content = req.body.content;
	const dead_line = new Date(req.body.dead_line);
	const memo = req.body.memo;

	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		const args = [
			uid,
			content,
			dead_line,
			memo
		]
		var query = "INSERT INTO todos_private(uid, content, dead_line, memo) VALUES (?,?,?,?)";
		query = mysql.format(query, args);
		console.log(query)
		connection.query(query, (error, results) => {
			res.json(results);
		})
	}
	else {
		res.json(403).send();
	}

})

// complete todos
app.put('/api/todos/isdone', async (req, res) => {
	const idToken = req.body.headers.Authorization;
	const id = req.body.id

	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		var query = "update todos_private set is_done = 1 where id= ?";
		query = mysql.format(query, id);
		console.log(query)
		connection.query(query, (error, results) => {
			// res.json(results);
			var selectQuery = "SELECT * FROM todos_private WHERE uid = ? and is_done = 0;";
			selectQuery = mysql.format(selectQuery, uid);
			connection.query(selectQuery, (error, results) => {
				res.json(results);
			})
		})
	}
	else {
		res.json(403).send();
	}

})

// edit private-todos
app.put('/api/todos/edit', async (req, res) => {
	const idToken = req.body.headers.Authorization;
	const id = req.body.id;
	const content = req.body.content;
	const dead_line = new Date(req.body.dead_line);
	const memo = req.body.memo;

	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		var query = "update todos_private set content = ?, dead_line = ?, memo = ? where id= ?";
		query = mysql.format(query, [content, dead_line, memo, id]);
		console.log(query)
		connection.query(query, (error, results) => {
			res.json(results);
		})
	}
	else {
		res.json(403).send();
	}

})

// edit shared-todos
app.put('/api/sharetodos/edit', async (req, res) => {
	const idToken = req.body.headers.Authorization;
	const id = req.body.id;
	const content = req.body.content;
	const dead_line = new Date(req.body.dead_line);
	const memo = req.body.memo;

	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		var query = "update todos_shared set content = ?, dead_line = ?, memo = ? where id= ?";
		query = mysql.format(query, [content, dead_line, memo, id]);
		console.log(query)
		connection.query(query, (error, results) => {
			res.json(results);
		})
	}
	else {
		res.json(403).send();
	}

})

// get shared-todos
app.get('/api/sharetodos', async (req, res) => {
	const idToken = req.header("Authorization");
	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		var query = "select todos_shared. * from todos_shared left outer join todos_shared_status on todos_shared.id = todos_shared_status.todo_shared_id left outer join members on members.id = todos_shared_status.member_id where uid=? and todos_shared_status.is_done = 0";
		query = mysql.format(query, uid);
		connection.query(query, (error, results) => {
			res.json(results);
		})
	} else {
		res.json(403).send();
	}
})

// post shared-todos
app.post('/api/sharetodos', async (req, res) => {
	const idToken = req.body.headers.Authorization;
	const team_id = req.body.team_id;
	const content = req.body.content;
	const dead_line = new Date(req.body.dead_line);
	const memo = req.body.memo;
	const args = [
		team_id,
		content,
		dead_line,
		memo
	]
	if (idToken) {

		var addShareTodoQuery = "INSERT INTO todos_shared(team_id, content, dead_line, memo) VALUES (?,?,?,?);";
		addShareTodoQuery = mysql.format(addShareTodoQuery, args);

		connection.query(addShareTodoQuery, (error, results) => {
			res.json(results);
		})
	}
	else {
		res.json(403).send();
	}
})

// complete shared-todos
app.put('/api/sharetodos/isdone', async (req, res) => {
	const idToken = req.body.headers.Authorization;
	const id = req.body.id

	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		var query = "update members inner join todos_shared_status on members.id = todos_shared_status.member_id set is_done = 1 where uid = ? and todo_shared_id = ?";
		query = mysql.format(query, [uid, id]);
		console.log(query)
		connection.query(query, (error, results) => {
			// res.json(results);
			var selectQuery = "select todos_shared. * from todos_shared left outer join todos_shared_status on todos_shared.id = todos_shared_status.todo_shared_id left outer join members on members.id = todos_shared_status.member_id where uid=? and todos_shared_status.is_done = 0";
			selectQuery = mysql.format(selectQuery, uid);
			connection.query(selectQuery, (error, results) => {
				res.json(results);
			})
		})
	}
	else {
		res.json(403).send();
	}
})

// get available-teams
app.get('/api/teams', async (req, res) => {
	const idToken = req.header("Authorization");
	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		var query = "SELECT id, name FROM teams WHERE exists (SELECT team_id FROM members WHERE teams.id = members.team_id and members.uid = ? )";
		query = mysql.format(query, uid);
		connection.query(query, (error, results) => {
			res.json(results);
		})

	} else {
		res.json(403).send();
	}

})

// get badges for shared-todos
app.get('/api/sharetodos/badges', async (req, res) => {
	const idToken = req.header("Authorization");
	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		var query = "select todos_shared.team_id, COUNT(todos_shared.team_id) from todos_shared left outer join todos_shared_status on todos_shared.id = todos_shared_status.todo_shared_id left outer join members on members.id = todos_shared_status.member_id where uid=? and todos_shared_status.is_done = 0 group by todos_shared.team_id";
		query = mysql.format(query, uid);
		connection.query(query, (error, results) => {
			res.json(results);
		})

	} else {
		res.json(403).send();
	}

})

// post status of shared-todos by each member
app.post('/api/sharetodos/status', async (req, res) => {
	const idToken = req.body.headers.Authorization;
	const team_id = req.body.team_id;
	const todo_shared_id = req.body.todo_shared_id;

	if (idToken) {
		var selectMemberQuery = "select * from members where team_id = ?";
		selectMemberQuery = mysql.format(selectMemberQuery, team_id);

		connection.query(selectMemberQuery, (error, results) => {
			results.map((teamMember) => {

				var member_id = teamMember.id;
				const statusArgs = [
					todo_shared_id,
					member_id
				];

				var addShareTodoStatusQuery = "INSERT INTO todos_shared_status(todo_shared_id, member_id) VALUES (?, ?)";
				addShareTodoStatusQuery = mysql.format(addShareTodoStatusQuery, statusArgs)
				connection.query(addShareTodoStatusQuery, (error, results) => {
				})
			})

		})
	}
	else {
		res.json(403).send();
	}

})

// get completed-todos
app.get('/api/todo/dones', async (req, res) => {
	const idToken = req.header("Authorization");
	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);

		var query = "SELECT * FROM todos_private WHERE uid = ? and is_done = 1;";
		query = mysql.format(query, uid);
		connection.query(query, (error, results) => {
			res.json(results);
		})
	}
	else {
		res.json(403).send();
	}

})

// uncomplete todos
app.put('/api/todo/dones', async (req, res) => {
	const idToken = req.body.headers.Authorization;
	const id = req.body.id

	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		var query = "update todos_private set is_done = 0 where id= ?";
		query = mysql.format(query, id);
		console.log(query)
		connection.query(query, (error, results) => {
			// res.json(results);
			var selectQuery = "SELECT * FROM todos_private WHERE uid = ? and is_done = 1;";
			selectQuery = mysql.format(selectQuery, uid);
			connection.query(selectQuery, (error, results) => {
				res.json(results);
			})
		})
	}
	else {
		res.json(403).send();
	}
})

// delete private-todos
app.delete('/api/todo/dones', async (req, res) => {

	const idToken = req.body.headers.Authorization;
	const id = req.body.id
	console.log(req.body)
	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		var query = "DELETE FROM todos_private where id= ?";
		query = mysql.format(query, id);
		console.log(query)
		connection.query(query, (error, results) => {
			// res.json(results);
			var selectQuery = "SELECT * FROM todos_private WHERE uid = ? and is_done = 1;";
			selectQuery = mysql.format(selectQuery, uid);
			connection.query(selectQuery, (error, results) => {
				res.json(results);
			})
		})
	}
	else {
		res.json(403).send();
	}

})

// get completed shared-todos
app.get('/api/sharetodos/dones', async (req, res) => {
	const idToken = req.header("Authorization");
	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		var query = "select todos_shared.id,content,dead_line,memo,teams.name,todos_shared_status.updated_at from todos_shared left outer join teams on todos_shared.team_id = teams.id left outer join todos_shared_status on todos_shared.id = todos_shared_status.todo_shared_id left outer join members on members.id = todos_shared_status.member_id  where todos_shared_status.is_done = 1 and members.uid=?;";
		query = mysql.format(query, uid);
		connection.query(query, (error, results) => {
			res.json(results);
		})
	} else {
		res.json(403).send();
	}
})

// uncomplete shared-todos
app.put('/api/sharetodos/dones', async (req, res) => {
	const idToken = req.body.headers.Authorization;
	const id = req.body.id

	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		var query = "update members inner join todos_shared_status on members.id = todos_shared_status.member_id set is_done = 0 where uid = ? and todo_shared_id = ?";
		query = mysql.format(query, [uid, id]);
		console.log(query)
		connection.query(query, (error, results) => {
			// res.json(results);
			var selectQuery = "select todos_shared.id,content,dead_line,memo,teams.name,todos_shared_status.updated_at from todos_shared left outer join teams on todos_shared.team_id = teams.id left outer join todos_shared_status on todos_shared.id = todos_shared_status.todo_shared_id left outer join members on members.id = todos_shared_status.member_id  where todos_shared_status.is_done = 1 and members.uid=?;";
			selectQuery = mysql.format(selectQuery, uid);
			connection.query(selectQuery, (error, results) => {
				res.json(results);
			})
		})
	}
	else {
		res.json(403).send();
	}
})

// delete shared-todos
app.delete('/api/sharetodos', async (req, res) => {
	const idToken = req.body.headers.Authorization;
	const todo_shared_id = req.body.id;

	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		var deleteStatusQuery = "DELETE FROM todos_shared_status WHERE todo_shared_id = ?";
		var deleteShareTodoquery = "DELETE FROM todos_shared WHERE id = ?"
		deleteStatusQuery = mysql.format(deleteStatusQuery, todo_shared_id);
		deleteShareTodoquery = mysql.format(deleteShareTodoquery, todo_shared_id);
		connection.query(deleteStatusQuery, () => {
			connection.query(deleteShareTodoquery, (error, results) => {
				var selectQuery = "select todos_shared. * from todos_shared left outer join todos_shared_status on todos_shared.id = todos_shared_status.todo_shared_id left outer join members on members.id = todos_shared_status.member_id where uid=? and todos_shared_status.is_done = 0";
				selectQuery = mysql.format(selectQuery, uid);
				connection.query(selectQuery, (error, results) => {
					res.json(results);
				})
			})
		})
	}
	else {
		res.json(403).send();
	}

})

// get uncompleted todos
app.get('/api/alltodos', async (req, res) => {
	const idToken = req.header("Authorization");
	if (idToken) {
		const { uid } = await admin.auth().verifyIdToken(idToken);
		var privateQuery = "select id, content, dead_line, memo, created_at from todos_private where uid = ? and is_done = 0;";
		privateQuery = mysql.format(privateQuery, uid);
		var shareQuery = "select todos_shared.id, content, dead_line, memo, todos_shared_status.created_at from todos_shared left join todos_shared_status on todos_shared.id = todos_shared_status.todo_shared_id left join members on members.id = todos_shared_status.member_id where members.uid = ? and todos_shared_status.is_done = 0;"
		shareQuery = mysql.format(shareQuery, uid);

		connection.query(privateQuery, (error, privateResults) => {
			connection.query(shareQuery, (error, shareResults) => {
				res.json(merge(privateResults, shareResults))
			})
		})
	}
	else {
		res.json(403).send();
	}
})

// get all teams
app.get('/api/teams/all', async (req, res) => {
	const idToken = req.header("Authorization");


	if (idToken) {
		var query = "SELECT * FROM teams";
		query = mysql.format(query);
		connection.query(query, (error, results) => {
			res.json(results);
		})
	}
	else {
		res.json(403).send();
	}
})

// join teams
app.post('/api/teams/join', async (req, res) => {
	const idToken = req.body.headers.Authorization;
	const teamIds = req.body.teamIds;
	const { uid } = await admin.auth().verifyIdToken(idToken);
	const userInfo = await admin.auth().getUser(uid);
	const userAccount = userInfo["email"].substr(0, userInfo['email'].indexOf("@"));
	console.log(userAccount)
	console.log(teamIds)
	var studentPattern = /[a-z]{2}[0-9]{4}[a-z]{4}/
	console.log(studentPattern.test(userAccount));
	if (idToken) {

		var query = "INSERT INTO members (team_id, uid) VALUES (?,?)"
		// var query = "MERGE into members using ( VALUES (?, ?)) as new (team_id, uid) on member.team_id = new.team_id and member.uid = new.uid whn not matched then insert (team_id, uid) values (teamId"
		for (index in teamIds) {
			let teamId = teamIds[index];
			let newQuery = mysql.format(query, [teamId, uid])
			console.log(index)
			connection.query(newQuery, (error, results) => {
				console.log(results)
			})
		}
	}
	else {
		res.json(403).send();
	}

})