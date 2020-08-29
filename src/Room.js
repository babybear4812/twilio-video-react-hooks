import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';
import db from '../firebase/firebase'

const Room = ({ roomName, token, handleLogout }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const participantConnected = participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
      console.log("participant is", participant)
      console.log("room is", room)
      if(participants.length === 0){
        db.collection("rooms").doc(room).set({
            Night: false,
            checkMajority: false,
            checkMedic: false,
            checkSeer: false,
            checkWerewolf: false,
            dead: [],
            gameStarted: false,
            majorityReached: false,
            medic: "",
            medicChoice: "",
            players: [],
            seer: "",
            seerChoice: "",
            villagers: [],
            villagersChoice: "",
            votesVillagers: [],
            votesWerewolves: [],
            werewolves: [],
            werewolvesChoice: ""
        })
      } // if
      else{ // if the room is already created, we simply replace participants array with our new state
        // db.collection("rooms").doc(room).update({participants: participants})
    };

    const participantDisconnected = participant => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };

    Video.connect(token, {
      name: roomName
    }).then(room => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <button onClick={handleLogout}>Log out</button>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ''
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;
