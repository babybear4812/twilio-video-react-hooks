import React, { useState, useEffect, useRef } from 'react';

const Participant = ({
  participant,
  handleVillagerVoteButton,
  handleSeerCheckButton,
  handleMedicSaveButton,
  handleWerewolfVoteButton,
  night,
  checkWerewolf,
  checkSeer,
  checkMedic,
  localRole,
  werewolfChoice,
  didSeerHit,
  gameStarted,
}) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    if (!participant) return;
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    console.log('were in useEffect[videoTracks]');
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
        console.log('were in useEffect[videoTracks] DETACHED');
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  if (!participant) return;
  if (!night) {
    return (
      <div className='participant'>
        <h3>DURING THE DAY NO OTHER CHECKS , role= {localRole}</h3>
        <h2>{werewolfChoice} was killed during the night </h2>
        <h3>{participant.identity}</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <audio ref={audioRef} autoPlay={true} muted={true} />
        <button onClick={() => handleVillagerVoteButton(participant.identity)}>
          Kill
        </button>
      </div>
    );
  } else if (!night && localRole === 'seer') {
    return (
      <div className='participant'>
        <h3>DURING THE DAY AND WE ARE THE SEER</h3>
        <h2>
          {werewolfChoice} was killed during the night , role= {localRole}
        </h2>
        <h2>{didSeerHit} is a werewolf</h2>
        <h3>{participant.identity}</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <audio ref={audioRef} autoPlay={true} muted={true} />
        <button onClick={() => handleVillagerVoteButton(participant.identity)}>
          Kill
        </button>
      </div>
    );
  } else if (night && !checkWerewolf && localRole === 'werewolf') {
    return (
      <div className='participant'>
        <h3>
          DURING THE NIGHT AND WEREWOLVES AREN'T DONE CHECKING AND WE ARE A
          WEREWOLF , role= {localRole}
        </h3>
        <h3>{participant.identity}</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <audio ref={audioRef} autoPlay={true} muted={true} />
        <button onClick={() => handleWerewolfVoteButton(participant.identity)}>
          Kill
        </button>
      </div>
    );
  } else if (night && checkWerewolf && !checkSeer && localRole === 'seer') {
    return (
      <div className='participant'>
        <h3>
          DURIONG THE NIGHT AND WEREWOLVES ARE DONE, SEER IS NOT DONE, AND WE
          ARE THE SEER , role= {localRole}
        </h3>
        <h3>{participant.identity}</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <audio ref={audioRef} autoPlay={true} muted={true} />
        <button onClick={(e) => handleSeerCheckButton(participant.identity)}>
          Check Role
        </button>
      </div>
    );
  } else if (
    night &&
    checkWerewolf &&
    checkSeer &&
    !checkMedic &&
    localRole === 'medic'
  ) {
    return (
      <div className='participant'>
        <h3>
          DURING THE NIGHT AND WEREWOLVES ARE DONE AND SEER IS DONE AND MEDIC IS
          NOT DONE AND WE ARE THE MEDIC , role= {localRole}
        </h3>
        <h3>{participant.identity}</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <audio ref={audioRef} autoPlay={true} muted={true} />
        <button onClick={(e) => handleMedicSaveButton(participant.identity)}>
          Save Person
        </button>
      </div>
    );
  } else if (!gameStarted) {
    return (
      <div className='participant'>
        <h3>GAME NOT STARTED, role= {localRole}</h3>
        <h3>{participant.identity}</h3>
        <h3>You are not allowed to see this person during the night</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <audio ref={audioRef} autoPlay={true} muted={true} />
      </div>
    );
  } else {
    console.log('IS GAME STARTED', gameStarted);
    return (
      <div className='participant'>
        <h3>
          222DURING THE NIGHT BUT WE ARE A VANILLA VILLAGER, OR DONE WITH OUR
          TASK, role= {localRole}
        </h3>
        <h3>{participant.identity}</h3>
        <h3>You are not allowed to see this person during the night</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <audio ref={audioRef} autoPlay={true} muted={true} />
      </div>
    );
  }
};

export default Participant;
