const { Task } = require("../models/task.model");
const { User } = require("../models/user.model");

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      attributes: [
        "id",
        "userId",
        "title",
        "startDate",
        "limitDate",
        "finishDate",
        "status",
      ],
      include: { model: User, attributes: ["id", "name", "email", "status"] },
    });

    res.status(200).json({
      status: "success",
      data: {
        tasks,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    status.toUpperCase();
    console.log(status.toUpperCase());
    const tasks = await Task.findAll({
      where: { status },
    });
    res.status(200).json({
      status: "success",
      data: {
        tasks,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const createTask = async (req, res) => {
  try {
    const { title, userId, startDate, limitDate } = req.body;
    const newTask = await Task.create({
      title,
      userId,
      startDate,
      limitDate,
    });
    res.status(201).json({
      status: "success",
      data: { newTask },
    });
  } catch (error) {
    console.log(error);
  }
};

const updateTask = async (req, res) => {
  try {
    const { task } = req;
    const { finishDate } = req.body;
    if (task.status === "ACTIVE") {
      const newTask = await task.update({ finishDate });
      const first = Date.parse(task.limitDate);
      const second = Date.parse(finishDate);
      if (first >= second) {
        newTask.update({ status: "COMPLETED" });
      } else {
        newTask.update({ status: "LATE" });
      }
      res.status(200).json({
        status: "success",
        data: { newTask },
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "This task was already finished",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteTask = async (req, res) => {
  try {
    const { task } = req;
    await task.update({ status: "CANCELLED" });
    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
};
