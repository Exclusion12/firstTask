import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/TaskList.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    taskId: "",
    taskName: "",
    progress: "Not started",
  });

  const [updateTask, changeTask] = useState({
    taskId: "",
    progress: "Not started",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios
      .get("https://localhost:2443/tasks", config)
      .then((response) => {
        setTasks(response.data);
        console.log(response.data);
      })
      .catch((error) => console.log(error));
  }, []);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleUpdateChange = (event) => {
    const { name, value } = event.target;
    changeTask({ ...updateTask, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("authToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios
      .post("https://localhost:2443/tasks", newTask, config)
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask({ taskId: "", taskName: "", progress: "Not started" });
        console.log(response.data);
      })
      .catch((error) => console.log(error));
  };
  const handleUpdateProgress = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("authToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios
      .put(
        `https://localhost:2443/tasks/${updateTask.taskId}`,
        { progress: updateTask.progress },
        config
      )
      .then((response) => {
        const updatedTask = response.data;
        setTasks(
          tasks.map((task) => {
            if (task.taskId._id === updatedTask.taskId) {
              task.progress = updatedTask.progress;
            }
            return task;
          })
        );
        updateTask.taskId = "";
        updateTask.progress = "Not started";
      })
      .catch((error) => console.log(error));
  };

  const deleteall = (event) => {
    const confirm = prompt("Enter yes to confirm deleting all tasks");
    if (confirm === "yes") {
      event.preventDefault();
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      axios
        .delete(`https://localhost:2443/tasks`, config)
        .then(() => {
          setTasks([]);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleTaskRemoval = (taskId) => {
    const confirm = prompt("Enter yes to confirm deleting task");
    if (confirm === "yes") {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      axios
        .delete(`https://localhost:2443/tasks/${taskId}`, config)
        .then(() => {
          const updatedTasks = tasks.filter(
            (task) => task.taskId._id !== taskId
          );
          setTasks(updatedTasks);
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <div>
      <h1>Add Task</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Task ID:
          <input
            type="text"
            name="taskId"
            value={newTask.taskId}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Task Name:
          <input
            type="text"
            name="taskName"
            value={newTask.taskName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Progress:
          <select
            name="progress"
            value={newTask.progress}
            onChange={handleInputChange}
          >
            <option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
            <option value="Finished">Finished</option>
          </select>
        </label>
        <button type="submit">Add Task</button>
      </form>

      <h1>Update Task</h1>
      <form onSubmit={handleUpdateProgress}>
        <label>
          Task ID:
          <input
            type="text"
            name="taskId"
            value={updateTask.taskId}
            onChange={handleUpdateChange}
          />
        </label>
        <label>
          Progress:
          <select
            name="progress"
            value={updateTask.progress}
            onChange={handleUpdateChange}
          >
            <option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
            <option value="Finished">Finished</option>
          </select>
        </label>
        <button type="submit">Update Task</button>
      </form>

      <h1>Delete all tasks</h1>
      <form onSubmit={deleteall}>
        <button type="submit">Delete all</button>
      </form>

      <h1>Task List</h1>
      <table className="task-list-table">
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Task Name</th>
            <th>Progress</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.taskId}>
              <td>{task.taskId.taskId}</td>
              <td>{task.taskId.taskName}</td>
              <td>{task.progress}</td>
              <td>
                <button
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => handleTaskRemoval(task.taskId._id)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
