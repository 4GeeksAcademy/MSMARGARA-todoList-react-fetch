import React, { useEffect, useState } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState([]);
  const [hoverItem, setHoverItem] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://playground.4geeks.com/apis/fake/todos/user/msmargara"
        );

        if (!response.ok) throw new Error("Error fetching data");

      const result = await response.json();
      console.log(result);
      const undoneTasks = result.filter(task => !task.done);
      setData(undoneTasks);
      setInputValue("");
  } catch (error) {
    console.error("Error:", error);
  }
    };

    fetchData();
    const today = new Date();
    const formattedDate = today.toLocaleDateString("es-AR"); 
    setCurrentDate(formattedDate);
  }, []);  

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = async () => {
    try {
      if (inputValue.trim() === "") {
        console.log("Por favor ingrese una tarea");
        return;
      }

      const newTask = { label: inputValue, done: false, id: Date.now().toString() };
      const newData = [...data, newTask];

      const response = await fetch(
        "https://playground.4geeks.com/apis/fake/todos/user/msmargara",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        }
      );

      if (!response.ok) {
        throw new Error("Error adding task");
      }

      const result = await response.json();
      console.log("Success:", result);

      setData(newData);
      setInputValue("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMouseEnter = (taskId) => {
    setHoverItem(taskId);
  };

  const handleMouseLeave = () => {
    setHoverItem(null);
  };

  const deleteTodo = async (taskId) => {
      try {
        const updatedData = data.map((task) =>
        task.id === taskId ? { ...task, done: true } : task
        );;
    
        const response = await fetch(
          "https://playground.4geeks.com/apis/fake/todos/user/msmargara",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          }
        );
    
        if (!response.ok) {
          throw new Error("Error updating task");
        }
    
        const result = await response.json();
        console.log("Response from PUT:", result);
    
        const undoneTasks = updatedData.filter((task) => !task.done);
    
        setData(undoneTasks);
      } catch (error) {
        console.error("Error updating task:", error);
      }
  };
  
  return (
    <div className="container px-5 py-3">
      <div className="d-flex justify-content-between align-items-end">
        <div>
          <h1 className="title">TO DO LIST</h1>
          <p>CHECK MY PENDING TASKS</p>
        </div>
        <div>
          <p className="fecha">{currentDate}</p>
        </div>
      </div>
      <input
	  	className="input w-100"
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
			<div className="d-flex justify-content-between">
				<div>
        ✓ <span>{task.label}</span>
				</div>
				<div>
				{hoverItem === task.id && (
					<span
						style={{
						cursor: "pointer",
						color: "white",
						fontWeight: "bold",
						marginRight: '2vh'
						}}
						onClick={() => deleteTodo(task.id)}
					>
						X
					</span>
				)}
				</div>
			</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

