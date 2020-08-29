import React, { useState, useEffect, useRef } from "react";

const Participant = ({ 
      participant,
      handleVillagerVoteButton,
      handleSeerCheckButton,
      handleMedicSaveButton,
      night,
      checkWerewolf,
      checkSeer,
      checkMedic,
      localRole,
      werewolfChoice,
      didSeerHit
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
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
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

  

  // return (
  //   <div className="participant">
  //     <h3>{participant.identity}</h3>
  //     <video ref={videoRef} autoPlay={true} />
  //     <audio ref={audioRef} autoPlay={true} muted={true} />
  //   </div>
  // );
  if(!night){
    return (
      <div>
        <h2>{werewolfChoice} was killed during the night</h2>
        <div className='participant'>
        <h3>{participant.identity}</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <audio ref={audioRef} autoPlay={true} muted={true} />
        <button onClick={() => handleVillagerVoteButton(userPeerId)}>Kill</button>
      </div>

      </div>
      
    );
  }
  if(!night && localRole === 'seer'){
    return (
      <div>
        <h2>{werewolfChoice} was killed during the night</h2>
        <h2>{didSeerHit} is a werewolf</h2>
        <div className='participant'>
        <h3>{participant.identity}</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <audio ref={audioRef} autoPlay={true} muted={true} />
        <button onClick={() => handleVillagerVoteButton(userPeerId)}>Kill</button>
      </div>

      </div>
      
    );
  }
  else if(night && !checkWerewolf && localRole === 'werewolf'){
    return (
      <div className='participant'>
        <h3>{participant.identity}</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <audio ref={audioRef} autoPlay={true} muted={true} />
        <button onClick={() => handleWerewolfVoteButton(userPeerId)}>Kill</button>
      </div>
    );
  }
  else if(night && checkWerewolf && !checkSeer && localRole === 'seer'){
    return (
      <div className='participant'>
        <h3>{participant.identity}</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <audio ref={audioRef} autoPlay={true} muted={true} />
        <button onClick={(e) => handleSeerCheckButton(userPeerId)}>Check Role</button>
      </div>
    );
  }
  else if(night && checkWerewolf && checkSeer && !checkMedic && localRole === 'medic'){
    return (
      <div className='participant'>
        <h3>{participant.identity}</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <audio ref={audioRef} autoPlay={true} muted={true} />
        <button onClick={(e) => handleMedicSaveButton(userPeerId)}>Save Person</button>
      </div>
    );
  }
  else {
    return (
      <div className='participant'>
        <h3>{participant.identity}</h3>
        <video ref={videoRef} autoPlay={false} muted={false} />
        <audio ref={audioRef} autoPlay={false} muted={false} />
       
      </div>
    );
  }

};

export default Participant;
