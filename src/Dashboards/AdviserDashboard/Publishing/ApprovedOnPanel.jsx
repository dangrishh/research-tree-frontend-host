import { useEffect, useState } from "react";
import {
  List,
  Typography,
  Button,
  message,
  Modal,
  Input,
  Checkbox,
  ConfigProvider,
  Select,
  Avatar,
} from "antd";
import {
  EditOutlined,
  CheckOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import axios from "axios";

import DocumentIcon from '../../../assets/view-docs.png';
import ReviseIcon from '../../../assets/revise.png';
import AddtaskIcon from '../../../assets/addtask.png';
import ApprovedIcon from '../../../assets/approved.png';
import gradeIcon from '../../../assets/grade.png';
import closeIcon from '../../../assets/close.png';

import CkEditorDocuments from "./CkEditorDocuments";
import GradingAdvicer from "./ViewGradePanel";





const { Text } = Typography;
const { Option } = Select;

export default function NewTables() {
  const [panelistStudents, setPanelistStudents] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [gradingStudentId, setGradingStudentId] = useState(null);

  const [courses, setCourses] = useState([]); // To store all unique courses
  const [filteredStudents, setFilteredStudents] = useState([]); // For filtering based on the course
  const [selectedCourse, setSelectedCourse] = useState(""); // For the selected course

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTaskStudent, setCurrentTaskStudent] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]); // To store tasks

  const [isGradeModalVisible, setIsGradeModalVisible] = useState(false); // State for grade modal

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPanelistStudents = async () => {
      try {
        const response = await fetch(
          `https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/advicer/panelist-students/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPanelistStudents(data.panelistStudents);
          setFilteredStudents(data.panelistStudents);
          // Extract unique courses from the students data
          const uniqueCourses = [
            ...new Set(data.panelistStudents.map((student) => student.course)),
          ];
          setCourses(uniqueCourses);
        } else {
          console.error("Error fetching panelist students");
        }
      } catch (error) {
        console.error("Error fetching panelist students:", error.message);
      }
    };

    fetchPanelistStudents();
  }, []);

  const handleViewManuscript = (studentId, channelId) => {
    setSelectedStudentId(studentId);
    setSelectedChannelId(channelId);
    setIsEditorOpen(true);
  };

  const closeEditorModal = () => {
    setIsEditorOpen(false); // Close modal
    setSelectedStudentId(null);
    setSelectedChannelId(null);
  };

  const handleViewGrade = (studentId) => {
    setGradingModalOpen(true);
    setGradingStudentId(studentId);
  };
  const closeGradingModal = () => {
    setGradingModalOpen(false); // Close modal
    setGradingStudentId(null);
  };


  // Task for Student

  const addTask = async (studentId, taskTitle) => {
    try {
      const response = await fetch(
        `https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/advicer/add-task/${studentId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskTitle }),
        }
      );
      if (response.ok) {
        setTasks([...tasks, { title: taskTitle, completed: false }]); // Add new task
        setTaskInput(""); // Clear task input
        fetchStudents(); // Refresh the list after adding a task
        
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateManuscriptStatus = async (channelId, newStatus) => {
    try {
      const response = await axios.patch(
        "https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/advicer/thesis/manuscript-status",
        { channelId, manuscriptStatus: newStatus } // Send student ID and new status
      );

      message.success("Manuscript status updated");
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        message.error(
          `Error: ${error.response.data.message || "Failed to update status"}`
        );
      } else {
        console.error("Error:", error.message);
        message.error("Error updating status");
      }
    }
  };

  const resetVotes = async (userId) => {
    try {
      const response = await axios.post(
        `https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/advicer/reset-manuscript-status/${userId}`  // Corrected URL
      );
  
      const { message: successMessage } = response.data;
      message.success(successMessage);
  
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        message.error(
          `Error: ${error.response.data.message || "Failed to reset votes"}`
        );
      } else {
        console.error("Error:", error.message);
        message.error("Error resetting votes");
      }
    }
  };


  const openTaskModal = (student) => {
    setCurrentTaskStudent(student);
    setIsModalVisible(true);
    fetchTasks(student._id); // Fetch tasks when opening modal
  };

  const handleTaskInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const handleAddTask = () => {
    if (taskInput) {
      addTask(currentTaskStudent._id, taskInput);
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks); // Update task list after deletion
  };

  const handleCompleteTask = (index) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks); // Update task completion status
  };

  // Handle course selection
  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    if (value === "") {
      setFilteredStudents(panelistStudents); // Show all students if no course is selected
    } else {
      setFilteredStudents(
        panelistStudents.filter((student) => student.course === value)
      );
    }
  };

  const openGradeModal = () => {
    setIsGradeModalVisible(true);
  };

  const closeGradeModal = () => {
    setIsGradeModalVisible(false);
  };

  const fetchTasks = async (studentId) => {
    try {
      const response = await fetch(
        `https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/advicer/tasks/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks); // Set fetched tasks
      } else {
        const errorData = await response.json();
        console.error("Error fetching tasks:", errorData.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  return (
    <div
      style={{ flex: 1, overflowX: "hidden", padding: "20px", width: "1263px" }}
    >
      <Select
        value={selectedCourse}
        onChange={handleCourseChange}
        style={{ marginBottom: "20px", width: "200px", marginLeft: '1000px' }}
        placeholder='Select a course'
      >
        <Option value=''>All Courses</Option>
        {courses.map((course) => (
          <Option key={course} value={course}>
            {course}
          </Option>
        ))}
      </Select>

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={filteredStudents.filter(
          (student) => student.manuscriptStatus === "Approved on Panel"
        )}
        renderItem={(student) => (
          <List.Item key={student._id}>
            <div
              style={{
                height: "auto", padding: "30px",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#2B2B2B",
                marginBottom: "16px",
              }}
            >
              <div style={{ flex: 1,   maxWidth: '890px',}}>
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  {student.proposalTitle}
                </Text>
                <br />
                <Text style={{ color: "gray" }}>
                  <span className='font-bold'>Authors: </span>
                  {student.groupMembers
                    .map((member) => member.replace(/([a-z])([A-Z])/g, "$1 $2")) // Insert space between lowercase and uppercase letters
                    .join(", ")}
                </Text>
                <br />
                
                <Text style={{ color: 'gray' }}>
                  <span className="font-bold">Panelists: </span>
                  {student.panelists && student.panelists.length > 0
                    ? student.panelists.map(panelist => panelist.name).join(', ')
                    : 'No panelists'}
                </Text>

                <br />
                {student.submittedAt && (
                   <Text style={{ color: "gray", marginRight: "10px" }}>
                    <span className='font-bold'>Date Uploaded:</span>{" "}
                    {new Date(student.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                )}
                 <Text style={{ color: "gray", display: 'none'}}>
                  <span className='font-bold'>Manuscript Status : </span>{" "}
                  {student.manuscriptStatus || "N/A"}
                </Text>
                <br />
                <p style={{ color: "#ffffff", marginTop: '10px'}}><span className='font-bold'>Course : </span>{student.course}</p>
                <p style={{ color: "#ffffff" }}><span className='font-bold'>Leader :</span> {student.name}</p>

                <br />

                {/* Advicer Profile */}

                <div className="flex">
                  <Avatar
                      src={`https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/public/uploads/${student.chosenAdvisor ? student.chosenAdvisor.profileImage || 'default-images.png' : 'default-images.png'}`}
                      sx={{  }}
                      style={{}}
                    />
                  <p style={{ color: "#ffffff", marginTop: '2px',}}><span className='font-bold ml-[10px]'></span> {student.chosenAdvisor ? student.chosenAdvisor.name : 'No advisor chosen'}</p>
                </div>

              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "10px",
                }}
              >
                                {/* <Button
                  icon={<EditOutlined />}
                  onClick={() => handleViewManuscript(student._id, student.channelId)}
                  style={{ marginBottom: "20px", width: "100px" }}
                /> */}

              <Button
                onClick={() =>
                  handleViewManuscript(student._id, student.channelId)
                }
               style={{ marginBottom: '10px', width: "105px" }}>
                  <img className="mr-[-4px]" src={DocumentIcon} />
               Document
              </Button>
                {/*                 <Button
                  icon={<LoadingOutlined />}  
                  onClick={() => updateManuscriptStatus(student._id, 'Revise on Panelist')}
                  style={{ marginBottom: "20px", width: "100px" }}
                />
                <Button
                  icon={<CheckOutlined />}
                  onClick={() => updateManuscriptStatus(student._id, 'Approved on Panel')}
                  style={{ marginBottom: "20px", width: "100px" }}
                /> */}
              <Button
              
              onClick={() => openTaskModal(student)}
              style={{ marginBottom: "10px", width: "105px" }}
            >
                 <img className="mr-[-4px]" src={AddtaskIcon} />
              View Task
            </Button>


                <Button
                  onClick={() => handleViewGrade(student._id)}
                  style={{ width: "105px" }}
                    > 
                      <img className="mr-[-4px]" src={gradeIcon} />
                    View Grade 
                </Button>

                {/* <Button
                      onClick={() => resetVotes(student._id)}
                      style={{marginBottom: '10px', width: "105px" }}
                    >
                <img className="mr-[-4px]" src="/src/assets/revise.png" /> 
                Reset 
              </Button> */}
              </div>
            </div>
          </List.Item>
        )}
      />

      {/*       {isEditorOpen && selectedStudentId && (
        <CkEditorDocuments
          userId={user._id}
          channelId={selectedChannelId}
          onClose={() => setIsEditorOpen(false)}
        />
      )} */}

          <Modal
            open={isGradeModalVisible}
            onCancel={closeGradeModal}
            footer={null}
            width="100%" // Makes the modal span the full width
            sx={{}}
            style={{
              top: 0,
               // Aligns the modal to the top of the screen
            }}
            bodyStyle={{
              height: "100vh", // Makes the modal body span the full height
              overflow: "hidden", // Prevents scrollbars inside the modal
              padding: 0,
               // Removes default padding
            }}
          >
          </Modal>

          {/* Material UI Modal for Grading */}
          <Dialog
            open={gradingModalOpen}
            onClose={closeGradingModal}
            fullWidth
            maxWidth='xl'
          >
            <DialogContent sx={{ background: '#1E1E1E',height: "auto", marginTop:'-400px', marginLeft: '-350px'}}>
              {gradingStudentId && (
                <GradingAdvicer
                  panelistId={user._id}
                  studentId={gradingStudentId}
                />
              )}
            </DialogContent>
            {/* <DialogActions>
              <Button onClick={closeGradingModal} color='primary'>
                Close
              </Button>
            </DialogActions> */}
          </Dialog>

          <Dialog
            open={isEditorOpen}
            onClose={closeEditorModal}
            fullWidth
            maxWidth='xxl'
          >
          <DialogActions sx={{ p: 0, border: 'none', margin: '15px'}}>
            <img
              onClick={closeEditorModal}
              className="inline-block mr-2 mb-1 h-[30px] w-[30px]"
              src={closeIcon}
              alt="Close"
              style={{
                cursor: 'pointer',
                transition: 'background-color 0.3s ease', // Optional transition for smooth hover effect
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            />
          </DialogActions>
            <DialogContent sx={{ height: "1200px" }}>
              {selectedStudentId && selectedChannelId && (
                <CkEditorDocuments
                  userId={user._id}
                  channelId={selectedChannelId}
                />
              )}
            </DialogContent>

          </Dialog>


      <ConfigProvider
        theme={{
          components: {
            Modal: {
              algorithm: true, // Enable algorithm
            },
          },
        }}
      >
      <Modal
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)} // Ensures modal can close
          footer={[
            <Button key='close' onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
/*             <Button key='add' type='primary' onClick={handleAddTask}>
              Add Task
            </Button>, */
          ]}
        >

          <Text strong style={{ fontSize: "18px", color: "#000000" }}>
            {currentTaskStudent?.proposalTitle || "Proposal Title"}
          </Text>
          <br />
          <br />
          <List
            dataSource={tasks}
            locale={{ emptyText: "No tasks found" }}
            renderItem={(task) => (
              <List.Item
                key={task._id}
                actions={[
/*                   <Checkbox
                    checked={task.isCompleted}
                    onChange={() => handleCompleteTask(task._id)}
                  >
                    {task.isCompleted ? "Completed" : "Pending"}
                  </Checkbox>, */

                  <Text style={{ fontWeight: "bold", color: task.isCompleted ? "green" : "red" }}>
                    {task.isCompleted ? "Completed" : "Not Done"}
                  </Text>
/*                   <Button
                    type='link'
                    icon={<DeleteOutlined />}
                    onClick={() => deleteTask(currentTaskStudent._id, task._id)} // Pass studentId and taskId
                  />, */
                ]}
              >
                <Text delete={task.isCompleted}>{task.taskTitle}</Text>
              </List.Item>
            )}
          />
        </Modal>
      </ConfigProvider>
    </div>
  );
}
