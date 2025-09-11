import React, { useEffect, useState } from "react";
import NavigationBar from "../components/Navbar";
import ClassroomTable from "../components/ClassroomTable";
import SectionTable from "../components/SectionTable";
import SessionModal from "../modals/SessionModal";
import ClassroomModal from "../modals/ClassroomModal";
import { fetchClassroom, fetchSections, fetchSessions } from "../services/apiresponse";

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

    useEffect(() => {
        const loadSessions = async () => {
            const data = await fetchSessions();
            setSessions(data);
            if (data.length > 0) {
                setSessionId(data[0]?._id);
            }
        };
        loadSessions();
    }, []);

    useEffect(() => {
    const loadClassrooms = async () => {
        const data = await fetchClassroom(sessionId);
        setClassrooms(Array.isArray(data) ? data : []);
        if (data.length > 0) {
            setClassroomId(data[0]?._id);
        }
    };
    loadClassrooms();
    }, [sessionId]);

    useEffect(() => {
    const loadSections = async () => {
        const data = await fetchSections(classroomId, sessionId);
        setSections(Array.isArray(data) ? data : []);
        if (data.length > 0) {
            setSectionId(data[0]?._id);
        }
    };
    loadSections();
    }, [classroomId, classrooms, sessionId]);

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