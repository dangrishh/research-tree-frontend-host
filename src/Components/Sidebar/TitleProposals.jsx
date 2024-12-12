import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from 'axios';
import {
  SendOutlined
} from '@ant-design/icons';

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Tag, Flex, message, Button, List, Avatar } from "antd";

import Textarea from "@mui/joy/Textarea";
import { borderRadius } from "@mui/system";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 720,
  height: 720,
  color: "white",
  bgcolor: "#1E1E1E",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

export default function BasicModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [title, setTitle] = useState("");
  const [proposal, setProposal] = useState("");
  const [submittedAt, setSubmittedAt] = useState(null); // Add this state for submittedAt

  const [results, setResults] = useState([]);
  const [topAdvisors, setTopAdvisors] = useState([]);
  const [advisorInfo, setAdvisorInfo] = useState(null);
  const [advisorStatus, setAdvisorStatus] = useState(null);
  const [panelists, setPanelists] = useState([]);
  const [getPanelists, setGetPanelists] = useState([]);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchStudentInfoAndProposal();
  }, []);

  const fetchStudentInfoAndProposal = async () => {
    try {
      const response = await fetch(
        `https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/student/advisor-info-StudProposal/${user._id}`
      );
      if (response.ok) {
        const data = await response.json();
        setAdvisorInfo(data.chosenAdvisor);
        setAdvisorStatus(data.advisorStatus);
        setGetPanelists(data.panelists || []);
        setProposal(data.proposal || ""); // Set proposal to an empty object if not found
        setSubmittedAt(data.submittedAt);
      } else {
        const errorData = await response.json();
        console.error(
          "Error fetching student info and proposal:",
          errorData.message
        );
      }
    } catch (error) {
      console.error("Error fetching student info and proposal:", error.message);
    }
  };

  const submitProposal = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/student/submit-proposal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            proposalTitle: title,
            proposalText: proposal,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();/* 
        setTopAdvisors(data.topAdvisors); //results */
        
        setTopAdvisors(data.results); // Setting top advisors from backend response=
        // setTitle('');  // Clear title field if needed
        // setProposal('');  // Clear proposal field if needed
        
        const newChannelId = data.channelId;
        localStorage.setItem("channelId", newChannelId);
        message.success("Proposal submitted successfully");
        console.log("Proposal submitted successfully!", data);

        // add the channel id if doesn't work on localStorage

        // Update the proposal state with the newly submitted data
        // setProposal({
        //   proposalTitle: data.proposalTitle,
        //   proposalText: data.proposalText,
        //   submittedAt: data.submittedAt,
        // });
      } else {
        const errorData = await response.json();
        console.error("Error submitting proposal:", errorData.message);
        message.error("Failed to submit proposal: " + errorData.message);
      }
    } catch (error) {
      console.error("Error submitting proposal:", error.message);
      message.error("An error occurred while submitting the proposal");
    }
  };

  // const chooseAdvisor = async (advisorId) => {
  //   try {
  //     const response = await fetch(
  //       "https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/student/choose-advisor",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ advisorId }),
  //       }
  //     );
  //     if (response.data.panelists) {
  //       // Filter the panelists to only include Technical Expert, Statistician, and Subject Expert
  //       const filteredPanelists = response.data.panelists.filter(panelist =>
  //         ['Technical Expert', 'Statistician', 'Subject Expert'].includes(panelist.role)
  //       );
  //       setPanelists(filteredPanelists);
  //     } else {
  //       const errorData = await response.json();
  //       console.error("Error choosing advisor:", errorData.message);
  //     }
  //   } catch (error) {
  //     console.error("Error choosing advisor:", error.message);
  //   }
  // };

// Function to choose an advisor and display panelists
const chooseAdvisor = async (advisorId) => {
  try {
    // Make a request to select the advisor
    const response = await axios.post('https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/student/choose-advisor', { 
      userId: user._id,
      advisorId,
    });

    if (response.data.student && response.data.student.panelists) {
      // Extract panelists with specific roles
      const filteredPanelists = response.data.student.panelists.filter(panelist =>
        ['Technical Expert', 'Statistician', 'Subject Expert'].includes(panelist.role)
      );
      fetchStudentInfoAndProposal();
      setPanelists(filteredPanelists);
      console.log("List Panelist : ", panelists)
      message.success("Advisor chosen and panelists assigned successfully");
    } else {
      fetchStudentInfoAndProposal();
      message.success("Advisor chosen and panelists assigned successfully");
    }
  } catch (err) {
    console.error("Error choosing advisor:", err.message);
  }
};

const showDeclineNotes = async () => {
  setIsNoteModalVisible(true);
  setLoadingNotes(true);

  try {
    const response = await fetch(
      `https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/student/declineNotes/${user._id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.ok) {
      const notesData = await response.json();
      setNotes(notesData);
    } else {
      console.error("Failed to fetch decline notes.");
    }
  } catch (error) {
    console.error("Error fetching decline notes:", error);
  } finally {
    setLoadingNotes(false);
  }
};

  const handleCloseDeclined = () => {
    setIsNoteModalVisible(false);
    setNotes([]);
  };

  return (
    <div>
      <button onClick={handleOpen}>
       
        {" "}
        <img
          className='mt-[420px] ml-[25px]'
          src="https://imgur.com/422ougl.jpg"
        ></img>{" "}
      </button>

      <Modal
        sx={{ border: "none"}}
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
  
      >
  <Box
    sx={{
      ...style,
      maxHeight: "90vh", // Limit modal height
      overflowY: "auto", // Enable scrolling for the modal content
    }}
  >
          <img
            className='mt-2 ml-[270px]'
            src="https://imgur.com/MzO2b68.png"

        
          />

          {/* Dynamic Title based on advisorStatus */}
          <Typography
            sx={{
              position: "absolute",
              marginLeft: "293px",
              top: "111px",
              fontWeight: "bold",
            }}
            id='modal-modal-title'
            variant='h6'
            component='h2'
          >
             
 
          </Typography>
          {/* Render based on advisor status */}
         

          {/* Render based on advisor status */}
          {(!advisorInfo || advisorStatus === "declined") && (
            <div>
              <Tag
                style={{
                  position: "absolute",
                  marginLeft: "100px",
                  marginTop: "40px",
                }}
                icon={<CloseCircleOutlined />}
                color='blue'
              >
                Submit your Proposals
              </Tag>

              <Tag
                style={{
                  position: "absolute",
                  marginLeft: "522px",
                  marginTop: "-100px",
                }}
                icon={<CloseCircleOutlined />}
                color='blue'
                onClick={() => showDeclineNotes(user._id)}

              >
                View Decline Note
              </Tag>


              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitProposal();
                }}
              >
                <Textarea
                  sx={{
                    color: "white",
                    position: "absolute",
                    top: "200px",
                    left: "117px",
                    borderRadius: "10px",
                    backgroundColor: "#1E1E1E",
                    borderColor: "#585050",
                    width: "495px",
                    height: "52px",
                    paddingLeft: "20px",
                    paddingTop: "10px",
                  }}
                  color='success'
                  minRows={2}
                  placeholder='Write your research title...'
                  size='sm'
                  required
                  variant='outlined'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                    <Textarea
                      sx={{
                        color: "white",
                        position: "absolute",
                        top: "310px",
                        left: "117px",
                        borderRadius: "10px",
                        backgroundColor: "#1E1E1E",
                        borderColor: "#585050",
                        width: "495px",
                        height: "152px",
                        paddingLeft: "20px",
                        paddingTop: "10px",
                        overflowY: "scroll",
                        resize: "vertical",
                        wordBreak: "break-word",
                      }}
                      color="success"
                      placeholder="Write your research proposal..."
                      size="sm"
                      required
                      variant="outlined"
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                    />
                {/* Add a submit button or trigger elsewhere */}
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{
                    position: "absolute",
                    display: "block",
                    background: isSubmitting ? "gray" : "blue",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    width: "104px",
                    height: "30px",
                    borderRadius: "16px",
                    marginTop: "245px",
                    marginLeft: "465px",
                  }}
                >
                  Submit <SendOutlined />
                </button>

              </form>
            </div>
          )}

          {/* pending output frontend */}

          {advisorInfo && advisorStatus === "pending" && (
           <div className="flex flex-col items-center justify-center relative mt-[60px]">
          
           <div className="absolute top-[-90px] text-[260px] text-[orange]">
             <SyncOutlined spin />
           </div>
           
         
           {/* Profile Image */}
           <img
             src={`https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/public/uploads/${advisorInfo.profileImage}`}
             className="w-[230px] h-[230px] rounded-full"
             alt={advisorInfo.name}
           />
         
           {/* Advisor Name */}
           <p className="text-[20px] font-bold mt-4 text-center">{advisorInfo.name}</p>
         
           {/* Specializations Tags */}
           <Flex
             style={{ marginTop: "10px" }}
             gap="4px 0"
             wrap
             className="justify-center"
           >
             {advisorInfo.specializations.map((specialization) => (
               <Tag key={specialization} color="#4E4E4E">
                 {specialization}
               </Tag>
             ))}
           </Flex>
         </div>
         
          )}

          {advisorInfo && advisorStatus === "accepted" && (
            <div>
              <div
                style={{
                  position: "absolute",
                  borderLeft: "2px solid #373737",
                  height: "240px",
                  top: "210px",
                  left: "350px",
                }}
              ></div>
              <Tag
                style={{
                  position: "absolute",
                  marginLeft: "350px",
                  marginTop: "-20px",
                }}
                icon={<CheckCircleOutlined />}
                color='#87d068'
              >
                Accepted
              </Tag>
              <img
                src={`https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/public/uploads/${advisorInfo.profileImage}`}
                className=' mt-[120px] ml-[60px] w-[197px] h-[197px] rounded-full border-[5px] border-green-500'
                alt={advisorInfo.name}
              />
              <p className='absolute text-[20px] font-bold ml-[350px] mt-[-193px]'>
                {advisorInfo.name}
              </p>

              <Flex
             style={{position: 'absolute', marginTop: "-140px", marginLeft: '350px', maxWidth: '300px' }}
             gap="4px 0"
             wrap
             className=""
           >
             {advisorInfo.specializations.map((specialization) => (
               <Tag key={specialization} color="#4E4E4E">
                 {specialization}
               </Tag>
             ))}
           </Flex>

              <h2 className='font-bold ml-[266px] text-[19px] mt-[66px]'>
                Your Panelists
              </h2>
              <ul className='flex ml-[150px] mt-[27px]'>
                {getPanelists.map((panelist) => (
                  <li key={panelist._id} className=''>
                    <img
                      src={`https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/public/uploads/${panelist.profileImage}`}
                      alt={panelist.name}
                      className=' w-[80px] h-[80px] rounded-full mr-[53px] '
                    />
                    <p className='text-sm ml-[-5px] mt-[6px]'>
                      {panelist.name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <br />
          {(!advisorInfo || advisorStatus === "declined") && (
            
            <section className='top-advisors'>
              {/* <h2 className='absolute font-bold ml-[260px] text-[19px] mt-[-310px]'>
                Title Proposals
              </h2> */}
              <h2 className='font-bold ml-[266px] text-[19px] mt-[280px]'>
                Top Advisors:
              </h2>
              
{/*               <ul className='flex ml-[150px] mt-[50px]'>
                {" "}
                {topAdvisors.map((result) => ( 
                  <li className='' key={advisor._id}>
                    <img
                      src={`https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/public/uploads/${advisor.profileImage}`}
                      alt={advisor.name}
                      className='w-[80px] h-[80px] rounded-full mr-[53px]'
                      onClick={() => chooseAdvisor(advisor._id)}
                    />
                    <p className='text-sm ml-[-17px] mt-[6px]'>
                      {advisor.name}
                    </p>
                  </li>
                ))}
              </ul> */}

              
              <ul className="flex justify-center items-center mt-[50px] ">
                {topAdvisors.map((result) => {
                  const { advisor, matchPercentage } = result;

                  // Conditional color based on the match percentage
                  const matchColor =
                    matchPercentage < 30
                      ? 'text-white' // Below 30% (Red)
                      : matchPercentage >= 80
                      ? 'text-[#33FF00]' // 80% and above (Green)
                      : matchPercentage >= 50
                      ? 'text-[#A0FF88]' // 50% to 79% (Yellow)
                      : 'text-[#FF8000]'; // 30% to 49% (Orange)

                  return (
                    <li key={advisor._id} className="text-center ml-[20px]">
                      <img
                        src={`https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/public/uploads/${advisor.profileImage}`}
                        alt={advisor.name}
                        className="w-[80px] h-[80px] rounded-full mb-2 mx-auto"
                        onClick={() => chooseAdvisor(advisor._id)}
                      />
                      
                      <p className={`text-sm mt-2 ${matchColor}`}>
                      <span className="whitespace-nowrap text-white font-bold">{advisor.name}</span> 
                      <span className="inline-block ml-1 whitespace-nowrap">Match: {matchPercentage}%</span>
                      </p>
                    
                    </li>
                  );
                })}
              </ul>



              {


/* {              Panelists Section
              {panelists.length > 0 && (
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'black', borderRadius: '4px' }}>
                  <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Panelists</h2>
                  <ul style={{ listStyleType: 'none', padding: '0' }}>
                    {panelists.map((panelist, index) => (
                      <li key={index} style={{ padding: '10px', backgroundColor: '#f1f1f1', borderRadius: '4px', marginBottom: '10px' }}>
                        <strong style={{color: 'black'}}>{panelist.name}</strong> -<p style={{color: 'black'}} >Role: {panelist.role}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
              
            </section>
          )}
        </Box>
      </Modal>


      {/* Decline Notes Modal */}
      <Modal
        open={isNoteModalVisible}
        onClose={handleCloseDeclined}
        aria-labelledby="decline-notes-modal"
        aria-describedby="decline-notes-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="decline-notes-modal" variant="h6" component="h2" gutterBottom>
            Decline Notes
          </Typography>
          {loadingNotes ? (
            <Typography variant="body2">Loading notes...</Typography>
          ) : notes.length > 0 ? (
            <List>
              {notes.map((note) => (
                <Box key={note._id} display="flex" alignItems="center" marginBottom={2}>
                  <Avatar src={`https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/public/uploads/${note.advisorId.profileImage}`} alt={note.advisorId.name} sx={{ marginRight: 2 }} />
                  <Box>
                    <Typography variant="subtitle1">{note.advisorId.name}</Typography>
                    <Typography variant="body2">{note.note}</Typography>
                    <small style={{ color: "#888" }}>
                      {new Date(note.createdAt).toLocaleString()}
                    </small>
                  </Box>
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body2">No decline notes found for this student.</Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
}
