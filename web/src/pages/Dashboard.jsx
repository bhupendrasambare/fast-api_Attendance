import React, { useEffect, useState } from "react";
import NavigationBar from "../components/Navbar";
import { BASE_URL } from "../services/urls";
import ClassroomTable from "../components/ClassroomTable";
import SectionTable from "../components/SectionTable";
import SessionModal from "../modals/SessionModal";
import ClassroomModal from "../modals/ClassroomModal";

const Dashboard = () => {
    const [sessionId, setSessionId] = useState("");
    const [classroomId, setClassroomId] = useState("");
    const [sectionId, setSectionId] = useState("");

    const [sessions, setSessions] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [sections, setSections] = useState([]);

    const [showSessionModal, setShowSessionModal] = useState(false); 
    const [showClassroomModal, setShowClassroomModal] = useState(false); 
    const [showSectionModal, setShowSectionModal] = useState(false); 


    const fetchSessions = () => {
        fetch(BASE_URL + "/sessions/", { headers: { accept: "application/json" } })
            .then((res) => res.json())
            .then((data) => {
                setSessions(data);
                if(data.length>0){
                    setSessionId(data[0]?._id)
                }
            })
            .catch((err) => console.error("Error fetching sessions:", err));
    };

    const fetchClassroom = () =>{
        const url = sessionId
        ? BASE_URL + `/classrooms/?session_id=${sessionId}`
        : BASE_URL + `/classrooms/`;

        fetch(url, { headers: { accept: "application/json" } })
            .then((res) => res.json())
            .then((data) => {
                if(data.length>0){
                    setClassroomId(data[0]?._id)
                }
                setClassrooms(Array.isArray(data) ? data : [])
            })
            .catch((err) => console.error("Error fetching classrooms:", err));
    }

    const fetchSections = () =>{
         if ((sessionId!="" || classroomId!="") && classrooms.length <=0){
            setSections([])
            return
        }
        const url = classroomId
        ? BASE_URL + `/sections/?classroom_id=${classroomId}`
        : BASE_URL + `/sections/`;

        fetch(url, { headers: { accept: "application/json" } })
            .then((res) => res.json())
            .then((data) => {
                if(data.length>0){
                    setSectionId(data[0]?._id)
                }
                setSections(Array.isArray(data) ? data : [])
            })
            .catch((err) => console.error("Error fetching sections:", err));
    }

    // Fetch sessions on load
    useEffect(() => {
        fetchSessions();
    }, []);

    // Fetch classrooms
    useEffect(() => {
        fetchClassroom();
    }, [sessionId]);

    useEffect(() => {
       fetchSections()
    }, [classroomId, classrooms]);

    return (
        <NavigationBar>
            <div className="w-100 ps-2">
                {/* Session Buttons */}
                <div className="d-flex justify-content-between my-3">
                    <div className="session-section">
                    {sessions.map((session) => (
                        <button
                            key={session._id}
                            onClick={() => setSessionId(session._id)}
                            className={
                            "btn shadow-lg rounded-pill mx-2 " +
                            (sessionId === session._id ? "btn-success" : "btn-light")
                            }
                        >
                        {session.start_year} - {session.end_year}
                        </button>
                    ))}
                    </div>
                    <div className="add-sessions">
                        <button className="btn btn-primary shadow-lg rounded-pill mx-2" onClick={() => setShowSessionModal(true)}>
                            Add Session
                        </button>
                    </div>
                </div>

                {/* Tables */}
                <div className="row d-flex flex-wrap justify-content-center">
                    <div className="col-sm-6">
                        <ClassroomTable
                            classroomId={classroomId}
                            classrooms={classrooms}
                            setClassroomId={setClassroomId}
                            onAdd={() => setShowClassroomModal(true)}
                        />
                    </div>
                    <div className="col-sm-6">
                        <SectionTable
                            sectionId={sectionId}
                            sections={sections}
                            setSectionId={setSectionId}
                        />
                    </div>
                </div>
            </div>
            {/* Modal */}
            <SessionModal
                show={showSessionModal}
                handleClose={() => setShowSessionModal(false)}
                refreshSessions={fetchSessions}
            />
            <ClassroomModal
                show={showClassroomModal}
                handleClose={() => setShowClassroomModal(false)}
                refreshClassrooms={fetchClassroom}
            />
        </NavigationBar>
    );
};

export default Dashboard;