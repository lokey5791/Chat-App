import React, { useState, useEffect } from "react";
import { useChatContext } from "stream-chat-react";
import { SearchIcon } from "../assests";

import { ResultsDropdown } from "../components";

function ChannelSearch({ setToggleContainer }) {
  const { client, setActiveChannel } = useChatContext();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [teamChannels, setTeamChannels] = useState([]);
  const [directChannels, setDirectChannels] = useState([]);

  const setChannel = (channel) => {
    setQuery("");
    setActiveChannel(channel);
  };

  const getChannels = async (text) => {
    try {
      const channelResponse = client.queryChannels({
        type: "team",
        name: { $autocomplete: text },
        members: { $in: [client.userID] },
      });

      const userResponse = client.queryUsers({
        id: { $ne: client.userID },
        name: { $autocomplete: text },
      });

      const [channels, { users }] = await Promise.all([
        channelResponse,
        userResponse,
      ]);

      console.log(channels, users);

      if (channels.length > 0) setTeamChannels(channels);
      if (users.length > 0) setDirectChannels(users);
    } catch (error) {
      setQuery("");
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setQuery(e.target.value);
    getChannels(e.target.value);
  };

  useEffect(() => {
    if (!query) {
      setDirectChannels([]);
      setTeamChannels([]);
    }
  }, [query]);

  return (
    <div className="channel-search__container">
      <div className="channel-search__input__wrapper">
        <div className="channel-search__input__icon">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={query}
          onChange={onSearch}
          placeholder="Search"
          className="channel-search__input__text"
        />
      </div>
      {query && (
        <ResultsDropdown
          teamChannels={teamChannels}
          directChannels={directChannels}
          loading={loading}
          setChannel={setChannel}
          setQuery={setQuery}
          setToggleContainer={setToggleContainer}
        />
      )}
    </div>
  );
}

export default ChannelSearch;
