import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';
import {db} from './firebase'

import {
  handleNightToDay,
  handleDayToNight,
  handleMajority,
  handleVillagerVoteButton,
  handleWerewolfVote,
  handleSeer,
  handleMedic,
  assignRolesAndStartGame,
} from './logicFunctions';

const Room = ({ roomName, token, handleLogout }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  // potentially needed game logic state
  const [night, setNight] = useState(true);
  const [localRole, setLocalRole] = useState("");
  const [gameStarted,setGameStarted] = useState(false)
  const [checkWerewolf, setCheckWerewolf] = useState(false)
  const [checkSeer, setCheckSeer] = useState(false)
  const [checkMedic, setCheckMedic] = useState(false)
  const [werewolfChoice, setWerewolfChoice] = useState(false)
  const [didSeerHit, setDidSeerHit] = useState(false)

  // checkWerewolf={checkWerewolf}
  //             checkSeer={checkSeer}
  //             checkMedic={checkMedic}
  //             werewolfChoice={werewolfChoice}
  //             didSeerHit={didSeerHit}
  useEffect(() => {
    db
    .collection('rooms')
    .doc(roomName)
    .onSnapshot(async (snapshot) => {
      let gameState = snapshot.data();

      if (!gameState.gameStarted) return;

      if (gameState.night) {
        handleNightToDay(gameState, roomName, room.localParticipant.sid);
      } else {
        handleDayToNight(gameState);
      }
    });
    
  }, [gameStarted]);

  useEffect(() => {
    const participantConnected = participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
      console.log("participant is", participant)
      
      console.log("room is in pconnected", roomName)
      if(participants.length === 0){
        db.collection("rooms").doc(roomName).set({
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
        let playerIdentitys = participants.map(participant => participant.identity)
        db.collection("rooms").doc(roomName).update({players: playerIdentitys})
      }
    };

    const participantDisconnected = participant => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
      let playerIdentitys = participants.map(participant => participant.identity)
      db.collection("rooms").doc(roomName).update({players: playerIdentitys})

    };

    Video.connect(token, {
      name: roomName
    }).then(room => {
      console.log("room is", room)
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
    <Participant key={participant.sid} participant={participant}
              handleVillagerVoteButton={handleVillagerVoteButton}
              handleSeerCheckButton={handleSeerCheckButton}
              handleMedicSaveButton={handleMedicSaveButton}
              handleWerewolfVoteButton={handleWerewolfVoteButton}

              night={night}
              localRole={localRole}
              checkWerewolf={checkWerewolf}
              checkSeer={checkSeer}
              checkMedic={checkMedic}
              werewolfChoice={werewolfChoice}
              didSeerHit={didSeerHit}

              
              />
              
             
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
