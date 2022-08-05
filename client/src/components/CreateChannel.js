import React, { useState } from "react";
import { useChatContext } from "stream-chat-react";
import { UserList } from "./";
import { CloseCreateChannel } from "../assests";

const ChannelNameInput = ({ channelName = "", setChannelName }) => {
  const { client, setActiveChannel } = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState([client?.userID || ""]);
  const handleChange = (e) => {
    e.preventDefault();
    setChannelName(e.target.value);
  };
  return (
    <div className="channel-name-input__wrapper">
      <p>Name</p>
      <input
        value={channelName}
        onChange={handleChange}
        placeholder="Channel name"
        type="text"
      />
      <p>Add Members</p>
    </div>
  );
};

function CreateChannel({ createType, setIsCreating }) {
  const [channelName, setChannelName] = useState("");
  const { client, setActiveChannel } = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState([client?.userID || ""]);

  const createChannel = async (e) => {
    e.preventDefault();
    try {
      const newChannel = await client.channel(createType, channelName, {
        name: channelName,
        members: selectedUsers,
      });
      await newChannel.watch();
      setChannelName("");
      setIsCreating(false);
      setSelectedUsers([client?.userID || ""]);
      setActiveChannel(newChannel);
    } catch (err) {}
  };

  return (
    <div className="create-channel__container">
      <div className="create-channel__header">
        <p>
          {createType === "team"
            ? "Create a new channel"
            : "Send a direct message"}
        </p>
        <CloseCreateChannel setIsCreating={setIsCreating} />
      </div>
      {createType === "team" && (
        <ChannelNameInput
          channelName={channelName}
          setChannelName={setChannelName}
        />
      )}
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className="create-channel__button-wrapper" onClick={createChannel}>
        <p>
          {createType === "team"
            ? "Create a new channel"
            : "Create a message group"}
        </p>
      </div>
    </div>
  );
}

export default CreateChannel;
