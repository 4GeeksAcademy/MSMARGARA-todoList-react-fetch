import React, {useEffect, useState} from "react";

const Home = () => {
	const [inputValue, setInputValue] = useState("");
	const [data, setData] = useState([]);
	const [hoverItem, setHoverItem] = useState(null);
	useEffect(() => {
		fetch("https://playground.4geeks.com/apis/fake/todos/user/msmargara", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify([]),
		})
			.then(resp => resp.json())
			.then(response => {
				if (response.msg === "The user exist") {
					console.log("Error al crear el usuario", response.msg);
					fetch("https://playground.4geeks.com/apis/fake/todos/user/msmargara")
					.then(resp => resp.json())
					.then((data)=> setData(data))
					.catch((error) => {console.error(error);});
				}
				else if(!response.ok){
					console.log("Error al generar usuario");
				}
				else if (response.ok){
					console.log("El usuario se creo correctamente")
					fetch("https://playground.4geeks.com/apis/fake/todos/user/msmargara")
					.then(resp => resp.json())
					.then((data)=> setData(data))
					.catch((error) => {console.error(error);});
			}  	})
			.catch((error) => {
				console.error(error);
			});
	}, []);  
	const handleChange = (event) => {
		setInputValue(event.target.value);
	};
	const handleAddTodo = () => {
		if (inputValue.trim() === "") {
			console.log("Por favor ingrese una tarea");
			return;
		}
		const newTask = { label: inputValue, done: false, id: Date.now().toString()};
		const newData = [...data, newTask];
		fetch("https://playground.4geeks.com/apis/fake/todos/user/msmargara", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newData),
		})
			.then(res => {
				if (!res.ok) throw Error(res.statusText);
				return res.json();
			})
			.then(response => {
				console.log('Success:', response);
				setData(newData);
				setInputValue(""); 
			})
			.catch(error => console.error(error));
	};	
	const handleMouseEnter = (taskId) => {
		setHoverItem(taskId);
	};
	const handleMouseLeave = () => {
		setHoverItem(null);
	};
	const deleteTodo = (taskId) => {
		fetch(`https://playground.4geeks.com/apis/fake/todos/user/Marina/${taskId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then(res => {
				console.log("Response status:", res.status);
				if (!res.ok) throw Error(res.statusText);
				return res.json();
			})
			.then(response => {
				console.log("Response from DELETE:", response);
				if (response.result === "ok") {
					setData(prevData => prevData.filter((task) => task.id !== taskId));
				} else {
					console.log("Error al borrar la tarea:", response);
				}
			})
			.catch(error => console.error(error));
	};
	return (
		<div className="text-center">
		  <h1 className="text-center mt-5">Todo List</h1>
		  <input
			type="text"
			value={inputValue}
			onChange={handleChange}
			onKeyDown={(e) => {
			  if (e.key === "Enter") {
				handleAddTodo();
			  }
			}}
		  />
		  <ul>
			{data.map((task) => (
				<li
				key={task.id}
				onMouseEnter={() => handleMouseEnter(task.id)}
				onMouseLeave={handleMouseLeave}
				>
					<span>{task.label}</span>
					{hoverItem === task.id && (
					<span
						style={{
						cursor: "pointer",
						marginLeft: "5px",
						color: "red",
						fontWeight: "bold",
						}}
						onClick={() => deleteTodo(task.id)}
					>
						X
					</span>
					)}
				</li>
			))}
		  </ul>
		</div>
	);
};
export default Home;