import React, { useEffect, useState } from "react";
import Tabs from "@mui/joy/Tabs";
import Modal from "@mui/joy/Modal";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
/* import Typography from '@mui/joy/Typography'; */
import {
  Space,
  Table,
  Tag,
  Avatar,
  Button,
  Divider,
  Typography,
 
} from "antd";
import { ConfigProvider } from "antd";
import { bgcolor, height, maxWidth, width } from "@mui/system";
import { color } from "highcharts";
import CloseIcon from '@mui/icons-material/Close'; // Importing the close icon

const { Column, ColumnGroup } = Table;
const { Title, Paragraph } = Typography;

export default function TabsPricingExample() {
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [declinedStudents, setDeclinedStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const [panelistStudents, setPanelistStudents] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/advicer/advisor-students/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAcceptedStudents(data.acceptedStudents);
          setDeclinedStudents(data.declinedStudents);
          setPendingStudents(data.pendingStudents);
        } else {
          const errorData = await response.json();
          console.error("Error fetching students:", errorData.message);
        }
      } catch (error) {
        console.error("Error fetching students:", error.message);
      }
    };

    fetchStudents();
    fetchPanelistStudents();
  }, [user._id]);

  const handleStudentResponse = async (studentId, status) => {
    try {
      const response = await fetch(
        "https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/advicer/respondTostudent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ studentId, advisorId: user._id, status }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();

        if (status === "accepted") {
          alert(responseData.message);
          // Refresh the tab to update the UI
          window.location.reload();
        } else {
          // Optionally clear the panelist students list if necessary
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        console.error("Error responding to student:", errorData.message);
        alert(
          errorData.message || "An error occurred. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error responding to student:", error.message);
      alert("An error occurred. Please try again later.");
    }
  };

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
      } else {
        console.error("Error fetching panelist students");
      }
    } catch (error) {
      console.error("Error fetching panelist students:", error.message);
    }
  };

  const showModal = (student) => {
    // Store the proposal data in state
    setSelectedProposal({
      title: student.proposalTitle,
      text: student.proposalText,
    });
    setIsModalVisible(true); // Show the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProposal(null); // Clear the selected proposal on cancel
  };

  return (
    <Tabs

      aria-label='Student Management'
      defaultValue={0}
      sx={{
        backgroundColor: "#1e1e1e",
        position: "absolute",
        left: "500px",
        top: "100px",
        width: 1243,
        height: "800px",
        borderRadius: "lg",

        overflow: "auto",
      }}
    >
      <TabList
        disableUnderline
        tabFlex={1}
        sx={{
          [`& .${tabClasses.root}`]: {
            fontSize: "lg",
            fontWeight: "lg",
            backgroundColor: "#1e1e1e", // Customize the tab background color
            color: "#ffffff", // Text color for unselected tabs
        
            [`&[aria-selected="true"]`]: {
              color: "green", // Text color for selected tab
              bgcolor: "#1e1e1e", // Background color for selected tab
            },
        
            // Hide or set hover background to transparent or #1e1e1e
            "&:hover": {
              backgroundColor: "transparent", // Or you can use '#1e1e1e' to match the background
            },
        
            [`&.${tabClasses.focusVisible}`]: {
              outlineOffset: "-4px",
            },
          },
        }}
        
      >
        <Tab disableIndicator variant='soft' sx={{ flexGrow: 1 }}>
          Accepted
        </Tab>
        <Tab disableIndicator variant='soft' sx={{ flexGrow: 1 }}>
          Declined
        </Tab>
        <Tab disableIndicator variant='soft' sx={{ flexGrow: 1 }}>
          Pending
        </Tab>
        <Tab disableIndicator variant='soft' sx={{ flexGrow: 1 }}>
          Panelists
        </Tab>
      </TabList>

      {/* Accepted Students List */}
      <TabPanel value={0}>
        <ConfigProvider
        theme={{
          token: {
            colorBgContainer: "#1e1e1e", // Dark background for the table
            colorText: "#fff",            // Ensure text is visible on the dark background
            tableBorderColor: "#333",     // Add border color to the table
            tableHeaderBg: "#1e1e1e",     // Match the header background with the table
            tableRowHoverBg: "transparent", // Disable row hover effect (optional)
            colorBorderSecondary: "#333", // Add a border color for secondary borders
            borderRadius: "4px",          // Optionally add rounded borders
          },
        }}
        
        >
    <div
      style={{
        position: "absolute",
        top: "100px",
        width: "80%",
        marginLeft: "120px",
        padding: "40px", // Optional padding for aesthetics
        borderRadius: "8px", // Optional for rounded corners
      }}
    >
      <Table
        pagination={false} 
        dataSource={acceptedStudents}
        rowKey="_id"
        bordered={false} // Ensure no borders are applied
        style={{
          background: "transparent", // Set transparent background
        }}
        showHeader={false} // Completely hides the table header
      >
        <Table.Column
          key="name"
          render={(text, student) => (
            <Space size="middle">
              <Avatar
                src={`https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/public/uploads/${
                  student.profileImage || "default-avatar.png"
                }`}
                style={{ width: 60, height: 60 }}
              >
                {student.name.charAt(0)}
              </Avatar>
              <span>{student.name}</span>
            </Space>
          )}
        />
        
      
        
        <Table.Column
     
          key="action"
          render={(_, student) => (
            <Space size="middle">
              <Button  onClick={() => showModal(student)}>View Proposal</Button>
            </Space>
          )}
        />
      </Table>
    </div>
  </ConfigProvider>
</TabPanel>


      {/* Declined Students List */}
      <TabPanel value={1}>
      <ConfigProvider
    theme={{
      token: {
        colorBgContainer: "#1e1e1e", // Dark background for the table
        colorText: "#fff",            // Ensure text is visible on the dark background
        tableBorderColor: "#333",     // Add border color to the table
        tableHeaderBg: "#1e1e1e",     // Match the header background with the table
        tableRowHoverBg: "transparent", // Disable row hover effect (optional)
        colorBorderSecondary: "#333", // Add a border color for secondary borders
        borderRadius: "4px",          // Optionally add rounded borders
      },
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "100px",
        width: "80%",
        marginLeft: "120px",
        padding: "40px", // Optional padding for aesthetics
        borderRadius: "8px", // Optional for rounded corners
      }}
    >
        <Table
          pagination={false} 
          dataSource={declinedStudents}
          rowKey='_id'
          bordered={false} // Ensure no borders are applied
          style={{
            background: "transparent", // Set transparent background
          }}
          showHeader={false} // Completely hides the table header
        >
          <Table.Column
            key='name'
            render={(text, student) => (
              <Space size='middle'>
                <Avatar
                  src={`https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/public/uploads/${
                    student.profileImage || "default-avatar.png"
                  }`}
                  style={{ width: 60, height: 60 }}
                >
                  {student.name.charAt(0)}
                </Avatar>
                <span>{student.name}</span>
              </Space>
            )}
          />
  
          <Table.Column
            title='Action'
            key='action'
            render={(_, student) => (
              <Space size='middle'>
                <Button onClick={() => showModal(student)}>
                  Review Proposal
                </Button>{" "}
                {/* Pass the student object to showModal */}
              </Space>
            )}
          />
        </Table>
        </div>
        </ConfigProvider>
      </TabPanel>

      {/* Pending Students List */}
      <TabPanel value={2}>
      <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "#1e1e1e", // Dark background for the table
          colorText: "#fff",            // Ensure text is visible on the dark background
          tableBorderColor: "#333",     // Add border color to the table
          tableHeaderBg: "#1e1e1e",     // Match the header background with the table
          tableRowHoverBg: "transparent", // Disable row hover effect (optional)
          colorBorderSecondary: "#333", // Add a border color for secondary borders
          borderRadius: "4px",          // Optionally add rounded borders
        },
      }}
    >
    <div
      style={{
        position: "absolute",
        top: "100px",
        width: "80%",
        marginLeft: "120px",
        padding: "40px", // Optional padding for aesthetics
        borderRadius: "8px", // Optional for rounded corners
      }}
    >
        <Table
          pagination={false} 
          dataSource={pendingStudents}
          rowKey='_id'
          bordered={false} // Ensure no borders are applied
          style={{
            background: "transparent", // Set transparent background
          }}
          showHeader={false} // Completely hides the table header
        >
          <Table.Column
            title='Name of Students'
            key='name'
            render={(text, student) => (
              <Space size='middle'>
                <Avatar
                  src={`https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/public/uploads/${
                    student.profileImage || "default-avatar.png"
                  }`}
                  style={{ width: 60, height: 60 }}
                >
                  {student.name.charAt(0)}
                </Avatar>
                <span>{student.name}</span>
              </Space>
            )}
          />
          <Table.Column
            title='Action'
            key='action'
            render={(_, student) => (
              <Space size='middle'>
                <Button onClick={() => showModal(student)}>
                  View Proposal
                </Button>{" "}
                {/* Pass the student object to showModal */}
                {/* <a
                  onClick={() => handleStudentResponse(student._id, "accepted")}
                >
                  Accept
                </a>
                <a
                  onClick={() => handleStudentResponse(student._id, "declined")}
                >
                  Decline
                </a> */}
              </Space>
            )}
          />

           <Table.Column
             key='action'
             render={(_, student) => (
              <Space size='middle'>
              
              <a
              className="text-green-500 hover:text-green-700 cursor-pointer"
              onClick={() => handleStudentResponse(student._id, "accepted")}
            >
              Accept
            </a>
            <a
              className="text-red-500 hover:text-red-700 cursor-pointer"
              onClick={() => handleStudentResponse(student._id, "declined")}
            >
            
              Decline
          
             
            </a>

              </Space>
            )}
          />
        </Table>
        </div>
        </ConfigProvider>
      </TabPanel>

      {/* List Panelist */}
      <TabPanel value={3}>
      <ConfigProvider
    theme={{
      token: {
        colorBgContainer: "#1e1e1e", // Dark background for the table
        colorText: "#fff",           // Ensure text is visible on the dark background
        tableBorderColor: "transparent", // Remove all table borders
        tableHeaderBg: "#1e1e1e",    // Match the header background with the table
        tableRowHoverBg: "transparent", // Disable row hover effect (optional)
        colorBorderSecondary: "transparent", // Remove any remaining border lines
      },
    }}
  >
   

        <Table
          pagination={false} 
          dataSource={panelistStudents}
          rowKey='_id'
          style={{
            position: "absolute",
            top: "100px",
            width: "87%",
            marginLeft: "120px",
          }}
        >
          <Table.Column
            title='Name of Students'
            key='name'
            render={(text, student) => (
              <Space size='middle'>
                <Avatar
                  src={`https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/public/uploads/${
                    student.profileImage || "default-avatar.png"
                  }`}
                  style={{ width: 60, height: 60 }}
                >
                  {student.name.charAt(0)}
                </Avatar>
                <span>{student.name}</span>
              </Space>
            )}
          />
         
          <Table.Column
            title='Adviser'
            key='advisor'
            render={(text, student) => (
              <Space size='middle'>
                {student.chosenAdvisor ? (
                  <>
                    <Avatar
                      src={`https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/public/uploads/${
                        student.chosenAdvisor.profileImage ||
                        "default-avatar.png"
                      }`}
                    />
                    <span>{student.chosenAdvisor.name}</span>
                  </>
                ) : (
                  <span>No advisor chosen</span>
                )}
              </Space>
            )}
          />
           <Table.Column
          title="Panel Members"  // Column title
          key="status"
          render={(text, student) => (
            <Space size='middle'>
              {student.chosenAdvisor ? (
                <>
                  <Avatar
                    src={`https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/public/uploads/${
                      student.chosenAdvisor.profileImage ||
                      "default-avatar.png"
                    }`}
                  />
                  <span>{student.chosenAdvisor.name}</span>
                </>
              ) : (
                <span>No advisor chosen</span>
              )}
            </Space>
          )}
        />
        </Table>
 
        </ConfigProvider>
      </TabPanel>

      {/* Modal to View Proposal */}
      

      <Modal
        open={isModalVisible}  // Controls visibility of modal
        onClose={handleCancel}  // Close the modal when triggered
        sx={{
          display: 'flex',          // Flexbox for centering the modal content
          justifyContent: 'center',
          alignItems: 'center',
          width: '90%',             // Modal width
          height: 500,             // Modal height
          backgroundColor: 'transparent', // Set background color to transparent
          padding: '20px',
          marginTop: '100px',
          marginLeft: '130px',
        }}
      >
        <div style={{ width: '90%' }}>
          {selectedProposal && (
            <div style={{ padding: "0px", width: '100%' }}>
              <h1 className="text-[#1e1e]">Research Title</h1>
              <Title
                level={2}
                style={{ color: 'white', fontWeight: 800 }}
              >
                {selectedProposal.title}
              </Title>{" "}
              <h1 className="text-[#1e1e]">Description</h1>
              {/* Display the proposal title in white */}
              <Paragraph style={{ color: 'white', fontSize: '20px', fontWeight: 300 }}>
                {selectedProposal.text}
              </Paragraph>{" "}
              {/* Display the proposal text in white */}
            </div>
          )}
        </div>
      </Modal>



      {/*        Pending Students 
      <TabPanel value={2}>
        <Typography variant="h6" color="#ffffff">
          Pending students to be managed.
        </Typography>
      </TabPanel> */}
    </Tabs>
  );
}
