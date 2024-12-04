import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown, Badge, List, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';


const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch notifications on component load
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/student/${user._id}/notifications`
        );
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user._id]);

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/student/notification/${notificationId}/read`
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

    // Separate notifications into two categories
    const unreadNotifications = notifications.filter((notif) => !notif.read);
    const readNotifications = notifications.filter((notif) => notif.read);
  

  const menu = (
    <div  style={{
      background: '#1E1E1E',
      width: "500px",
      maxHeight: "800px",
      overflowY: "auto",
      padding: 20,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Added boxShadow
    }}>
      {/* Unread Notifications Header */}
      {unreadNotifications.length > 0 && (
        <>
          <div style={{ fontWeight: "bold", marginBottom: "10px", color: "white", padding: '10px'}}>
            Unread Notifications
          </div>
          <List
            itemLayout="horizontal"
            dataSource={unreadNotifications}
            loading={loading}
            renderItem={(item) => (
              <List.Item
              style={{
                color: "white",
                background: "#2b2b2b",
                borderBottom: "1px solid #3a3a3a",
                marginTop: 3,
                padding: "15px",
              }}
              >
                <div style={{ width: "100%" }}>
                  <p style={{ margin: 0 }}>{item.message}</p>
                  <small style={{ color: "#888" }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </small>
                  <Button
                    size="small"
                    type="link"
                    onClick={() => markAsRead(item._id)}
                  >
                    Mark as Read
                  </Button>
                </div>
              </List.Item>
            )}
          />
        </>
      )}

      {/* Read Notifications Header */}
      {readNotifications.length > 0 && (
        <>
          <div style={{ fontWeight: "bold", marginBottom: "10px", color: "white" ,  padding: '10px',}}>
            Read Notifications
          </div>
          <List
            itemLayout="horizontal"
            dataSource={readNotifications}
            loading={loading}
            renderItem={(item) => (
              <List.Item
                style={{
                  color: "white",
                  background: "#1E1E1E",
                  borderBottom: "1px solid #3a3a3a",
                  marginTop: 3,
                  padding: "15px",
                }}
              >
                <div style={{ width: "100%" }}>
                  <p style={{ margin: 0 }}>{item.message}</p>
                  <small style={{ color: "#888" }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </small>
                </div>
              </List.Item>
            )}
          />
        </>
      )}
    </div>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Badge count={unreadNotifications.length}>
        <NotificationsActiveOutlinedIcon style={{ color: "white", fontSize: "34px", cursor: "pointer" }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
