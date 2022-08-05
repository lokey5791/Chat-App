import React, { useEffect, useState } from "react";
import { Avatar, useChatContext } from "stream-chat-react";

import { InviteIcon } from "../assests";

const ListContainer = ({ children }) => {
  return (
    <div className="user-list__container">
      <div className="user-list__header">
        <p>User</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  );
};

const UserItem = ({ user, setSelectedUsers }) => {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    if (selected) {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((prevUser) => prevUser.id !== user.id)
      );
    } else {
      setSelectedUsers((prevSelectedUsers) => {
        return [...prevSelectedUsers, user.id];
      });
    }
    setSelected((prevSelected) => !prevSelected);
  };
  return (
    <div className="user-item__wrapper" onClick={handleClick}>
      <div className="user-item__name-wrapper">
        <Avatar image={user.image} name={user.fullName || user.id} size={32} />
        <p className="user-item__name">{user.fullName || user.id}</p>
      </div>
      {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
    </div>
  );
};

export default function UserList({ setSelectedUsers }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [error, setError] = useState(false);
  const { client } = useChatContext();

  useEffect(() => {
    const getUsers = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const response = await client.queryUsers(
          { id: { $ne: client.userID } },
          { id: 1 },
          { limit: 8 }
        );

        if (response) {
          setUsers(response.users);
          setListEmpty(false);
        } else {
          setListEmpty(true);
        }
        setError(false);
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };
    if (client) getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <ListContainer>
        <div className="user-list__message">
          Error loading, please refresh and try again
        </div>
      </ListContainer>
    );
  }
  if (listEmpty) {
    return (
      <ListContainer>
        <div className="user-list__message">No users found.</div>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {loading ? (
        <div className="user-list__message">Loading users...</div>
      ) : (
        users?.map((user, i) => {
          return (
            <UserItem
              key={user.id}
              index={i}
              user={user}
              setSelectedUsers={setSelectedUsers}
            />
          );
        })
      )}
    </ListContainer>
  );
}
