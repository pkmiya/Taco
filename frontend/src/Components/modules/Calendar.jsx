import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import { addDays, differenceInCalendarDays } from 'date-fns';
// import axios from "axios";
import styled from "styled-components";
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, ListSubheader, CircularProgress, DialogTitle, Dialog, DialogContent, DialogContentText, Slide } from '@mui/material';
import { auth } from '../../firebase';
import axios from './axios';
// const baseURL = "http://localhost:8080";

const CalendarContainer = styled.div`
	/* GENERAL STYLES */
	.react-calendar { 
		margin: 15px auto;				/* Margin for above and below, and Center the calendar horizontally */
		width: 95%;
		max-width: 100%;
		background-color: #fff;
		color: #222;
		border-radius: 8px;
		// box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
		font-family: Arial, Helvetica, sans-serif;
		line-height: 1.125em;
	}
	.react-calendar__navigation button {
		color: #6f48eb;
		min-width: 44px;
		background: none;
		font-size: 16px;
		margin-top: 8px;
	}
	.react-calendar .react-calendar__tile:nth-child(7n){
		color: #00f;				/* Set Saturday cells bluish */
	}
	.react-calendar .react-calendar__month-view__days__day--neighboringMonth{
		color: #757575 !important;	/* In month view, set future cells gray */
	}
	.react-calendar__tile--active, .react-calendar__tile--active:enabled:hover,
	.react-calendar__tile--active:enabled:focus {
		outline: 2px solid #006edc !important;
		outline-offset: -1px;
		z-index: 1;
		color: black;
	}
	/* HEATMAP STYLES */
	.highlight-5 { background-color: #ff2b2b !important; }
	.highlight-4 { background-color: #ff5555 !important; }
	.highlight-3 { background-color: #ff8080 !important; }
	.highlight-2 { background-color: #ffaaaa !important; }
	.highlight-1 { background-color: #ffd4d4 !important; }
	.highlight-0 { background-color: #ffffff !important; }
`;

function isSameDay(a, b) {
	return differenceInCalendarDays(a, b) === 0;
}

function getTileClassName(date, todos, now) {
	const dead_lines = todos.map(todo => new Date(todo.dead_line));
	const daysleft = dead_lines.map(dead_line => differenceInCalendarDays(dead_line, now));

	const points = [];
	for (let i = 0; i < daysleft.length; i++) {
		let point = 1;
		if (daysleft[i] > 0) point = 1 / daysleft[i];

		for (let j = 0; j <= daysleft[i]; j++) {
			if (points.length === 0 || j === points.length) points.push(point);
			else points[j] += point;
		}
	}
	const highlightedDates = [];
	for (let i = 0; i < points.length; i++) highlightedDates.push(addDays(now, i));

	if (!highlightedDates.find((dDate) => isSameDay(dDate, date))) return;
	let index = highlightedDates.findIndex((dDate) => isSameDay(dDate, date));
	if (points[index] >= 1.0) return "highlight-5";
	else if (points[index] >= 0.7) return "highlight-4";
	else if (points[index] >= 0.5) return "highlight-3";
	else if (points[index] >= 0.2) return "highlight-2";
	else if (points[index] > 0) return "highlight-1";
	else return "highlight-0";
}

function TodoList(props) {

	function displayTodoList(todos, value) {
		let todos_yet = [];
		for (let i = 0; i < todos.length; i++) {
			if (new Date(todos[i]['dead_line']) > value) {
				todos_yet.push(todos[i]);
			};
		}

		const changeDate = (deadLineDate) => {
			const date = new Date(deadLineDate);
			const dateString = date.toLocaleDateString();
			return dateString;
		}
		return (
			<React.Fragment>
				<List variant="outlined" sx={{ border: "1px solid #999", borderRadius: 2, width: '95%', boxShadow: 'sm', bgcolor: 'background.body', margin: "0 auto" }} >
					<ListSubheader sx={{ lineHeight: "30px" }}>{`選択日: ${value.toLocaleDateString()} / ${todos_yet.length}件`}</ListSubheader>
					{todos_yet.length === 0 ?
						( // NOT EXIST
							<ListItem><ListItemText primary="該当なし" /></ListItem>
						) :
						( // EXIST
							todos_yet.map(todo => {
								function differenceInCalendarDays(a, b) {
									return Math.ceil((new Date(a) - new Date(b)) / (1000 * 60 * 60 * 24));
								}
								return (
									<div key={todo.id}>
										<ListItem sx={{ padding: "0 3%" }}>
											<ListItemButton sx={{ paddingTop: 0, paddingBottom: 0 }} onClick={() => props.dialogOpen(todo['content'], todo['dead_line'], todo['created_at'], todo['memo'])}>
												<ListItemText primary={todo.content} secondary={changeDate(todo['dead_line']) + " / あと" + differenceInCalendarDays(todo['dead_line'], value) + "日"} />
											</ListItemButton>
										</ListItem>
										<Divider variant="middle" />
									</div>
								);
							})
						)}
				</List>
				<Box sx={{ height: "75px" }}></Box>
			</React.Fragment>
		)
	}

	const { value, todos } = props;
	const sortedTodos = todos.sort((a, b) => new Date(a['dead_line']) - new Date(b['dead_line']));

	return (
		<React.Fragment>
			{displayTodoList(sortedTodos, value)}
		</React.Fragment>
	)
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});


export default function App() {

	const changeDate = (deadLineDate) => {
		const date = new Date(deadLineDate);
		const dateString = date.toLocaleDateString();
		return dateString;
	}

	function eraseTimeData(date) {
		const year = date.getFullYear(date);
		const month = date.getMonth(date) + 1;
		const day = date.getDate(date);
		const date_without_time = year + '/' + month + '/' + day;
		return new Date(date_without_time);
	}

	const now = eraseTimeData(new Date());
	const [value, onChange] = useState(now);

	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [detailOpen, setDetailOpen] = useState({ 'open': false, 'content': '', 'dead_line': '', 'created_at': '', 'memo': '' });

	useEffect(() => {
		const accessToken = auth.currentUser.accessToken;
		const fetchTodos = async () => {
			const response = await axios.get(`/alltodos`, {
				headers: { Authorization: accessToken }
			})
			const body = await response.data;
			setTodos(body);
			setIsLoading(false);
		}
		fetchTodos();
	}, []);

	const dialogOpen = (content, dead_line, created_at, memo) => {
		setDetailOpen({ 'open': true, 'content': content, 'dead_line': dead_line, 'created_at': created_at, 'memo': memo, })
	}

	const dialogClose = () => {
		setDetailOpen({ 'open': false, 'content': '', 'dead_line': '', 'created_at': '', 'memo': '', })
	}


	return (
		<React.Fragment>
			{isLoading === false ? (
				<div>
					<CalendarContainer>
						<Calendar
							onChange={onChange} value={value} calendarType="US" locale='en-EN'
							tileClassName={(props) => {
								if (props.view !== "month") return;
								return getTileClassName(props.date, todos, now);
							}}
						/>
					</CalendarContainer>

					<Dialog
						open={detailOpen['open']}
						TransitionComponent={Transition}
						keepMounted
						onClose={dialogClose}
					>
						<React.Fragment>
							{detailOpen.content ==='' ? (
								<div>

								</div>
							) : (
								<React.Fragment>
									<DialogTitle>{`${detailOpen['content']}`}</DialogTitle>
									<DialogContent>
										<DialogContentText >
											{`〆切：${changeDate(detailOpen['dead_line'])}`}<br />
											{`メモ：${detailOpen['memo']}`}<br /><br />
											{`作成日：${changeDate(detailOpen['created_at'])}`}
										</DialogContentText>
									</DialogContent>
								</React.Fragment>
							)}
						</React.Fragment>
					</Dialog>

					<TodoList value={value} todos={todos} dialogOpen={dialogOpen} />
				</div>
			) : (
				<Box sx={{ position: 'absolute', top: '45%', left: '40%' }}>
					<CircularProgress size={70} />
				</Box>

			)}
		</React.Fragment>

	);
}