import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown, Badge, List, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  
console.log("user", user);

  // Fetch notifications on component load
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/advicer/${user._id}/notifications`
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
        `https://researchtree-backend-heroku-1f677bc802ae.herokuapp.com/api/advicer/notification/${notificationId}/read`
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

  const menu = (
    <div style={{ width: "400px",  maxHeight: "400px", overflowY: "auto", borderRadius: 10,}}>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        loading={loading}
        renderItem={(item) => (
          <List.Item
          style={{
            color: 'white',
            background: item.read ? "gray" : "#343434",
            borderBottom: "1px solid #ddd",
            padding: "15px",
          }}
          >
            <div style={{ width: "100%" }}>
              <p style={{ margin: 0 }}>{item.message}</p>
              <small style={{ color: "#888" }}>
                {new Date(item.timestamp).toLocaleString()}
              </small>
              {!item.read && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => markAsRead(item._id)}
                >
                  Mark as Read
                </Button>
              )}
            </div>
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Badge count={notifications.filter((n) => !n.read).length}>
        <BellOutlined style={{ color: 'white',fontSize: "34px", cursor: "pointer" }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
