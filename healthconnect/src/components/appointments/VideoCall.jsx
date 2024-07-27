import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaComments, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { firestore, pc } from "../../../main";
import { answerCall } from "../../features/call";
import { useSelector, useDispatch } from "react-redux";
import { addCallId, resetCallId } from "../../features/SharedData";

export default function VideoCall() {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const callId = useSelector(state => state.sharedData.callId);
    const userId = useSelector(state => state.sharedData.profile.patient.id);
    const dispatch = useDispatch();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const pcRef = useRef(null); // Add a ref for peer connection

    useEffect(() => {
        const getStreams = async () => {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const remoteStream = new MediaStream();
            localStreamRef.current = localStream;

            pcRef.current = pc;

            localStream.getTracks().forEach((track) => {
                pc.addTrack(track, localStream);
            });

            pc.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.addTrack(track);
                });
            };

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream;
            }

            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }

            // Handle cleanup on component unmount
            return () => {
                pc.close();
                if (localStreamRef.current) {
                    localStreamRef.current.getTracks().forEach(track => track.stop());
                }
            };
        };

        getStreams();
    }, [callId]);

    useEffect(() => {
        if (callId) {
            const unsubscribe = firestore
                .collection("calls")
                .doc(callId)
                .collection("messages")
                .orderBy("timestamp")
                .onSnapshot((snapshot) => {
                    const fetchedMessages = snapshot.docs.map(doc => doc.data());
                    setMessages(fetchedMessages);
                });

            return () => unsubscribe();
        }
    }, [callId]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        }
    };

    const toggleVideo = () => {
        setIsVideoOff(!isVideoOff);
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        }
    };

    const handleHangup = () => {
        alert("Hanging up the call...");
        if (pcRef.current) {
            pcRef.current.close(); // Close the peer connection
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop()); // Stop all tracks
        }
        dispatch(resetCallId()); // Reset the call ID
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() !== "") {
            await firestore.collection("calls").doc(callId).collection("messages").add({
                text: newMessage,
                timestamp: new Date(),
                senderId: userId,
            });
            setNewMessage("");
        }
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div className="relative w-full h-full bg-gray-900 flex">
            <input
                type="text"
                onChange={(e) => dispatch(addCallId(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && answerCall(callId) && console.log('answering', callId)}
            />
            <div className={`relative ${isChatOpen ? 'w-full md:w-3/4' : 'w-full'} h-full bg-gray-900 transition-all`}>
                <div className="absolute right-4 top-4 w-1/3 h-1/4 md:w-1/4 md:h-1/3 bg-black rounded-md overflow-hidden shadow-lg">
                    <video
                        id="user-1"
                        ref={localVideoRef}
                        className="w-full h-full flex items-center justify-center text-white text-lg md:text-2xl"
                        autoPlay
                        playsInline
                    />
                </div>

                <div className="w-full h-full bg-black flex items-center justify-center text-white text-2xl md:text-4xl">
                    <video
                        id="user-2"
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                    />
                </div>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 md:w-1/2 bg-[#DDE4F0] p-2 md:p-3 rounded-md flex justify-around items-center shadow-lg">
                    <div className="mute cursor-pointer" onClick={toggleMute}>
                        {isMuted ? (
                            <FaMicrophoneSlash className="text-red-600 text-2xl" />
                        ) : (
                            <FaMicrophone className="text-green-600 text-2xl" />
                        )}
                    </div>
                    <div className="video-toggle cursor-pointer" onClick={toggleVideo}>
                        {isVideoOff ? (
                            <FaVideoSlash className="text-red-600 text-2xl" />
                        ) : (
                            <FaVideo className="text-green-600 text-2xl" />
                        )}
                    </div>
                    <div className="hangup cursor-pointer" onClick={handleHangup}>
                        <FaPhoneSlash className="text-red-600 text-2xl" />
                    </div>
                    <div className="chat-toggle cursor-pointer" onClick={toggleChat}>
                        {isChatOpen ? (
                            <FaTimes className="text-gray-600 text-2xl" />
                        ) : (
                            <FaComments className="text-gray-600 text-2xl" />
                        )}
                    </div>
                </div>
            </div>

            {isChatOpen && (
                <div className="w-full md:w-1/4 h-full bg-white flex flex-col shadow-lg transition-all overflow-hidden">
                    <div className="flex-grow p-2 md:p-4 overflow-y-auto text-wrap">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-1 md:p-2 rounded-lg my-1 md:my-2 ${msg.senderId === userId ? 'bg-blue-200' : 'bg-gray-200'}`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="p-2 md:p-4 border-t border-gray-300 flex">
                        <input
                            type="text"
                            className="flex-grow p-1 md:p-2 border border-gray-300 rounded-lg mr-2"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder="Type your message..."
                        />
                        <button
                            className="bg-blue-500 text-white p-1 md:p-2 rounded-lg"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
