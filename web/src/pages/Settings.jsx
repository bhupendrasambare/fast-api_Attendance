import React, { useState } from 'react'
import NavigationBar from '../components/Navbar'

const Settings = () => {

    const [sessionId, setSessionId] = useState();
    const [classroomId, setClassroomId] = useState();
    const [sectionId, setSectionId] = useState();

    const [sessions,setSessions] = useState([])
    const [classrooms, setClassRooms] = useState([])
    const [sections, setSections] = useState([])

  return (
    <NavigationBar>

        <div className="w-100 ps-2">
            
            <div className="d-flex justify-content-between my-3">
                <div className="session-section">
                    <button className="btn btn-success shadow-lg rounded-pill mx-2"> 2019 - 2023 </button>
                    <button className="btn btn-light shadow-lg rounded-pill mx-2"> 2019 - 2023 </button>
                    <button className="btn btn-light shadow-lg rounded-pill mx-2"> 2019 - 2023 </button>
                    <button className="btn btn-light shadow-lg rounded-pill mx-2"> 2019 - 2023 </button>
                    <button className="btn btn-light shadow-lg rounded-pill mx-2"> 2019 - 2023 </button>
                    <button className="btn btn-light shadow-lg rounded-pill mx-2"> 2019 - 2023 </button>
                </div>
                <div className="add-sessions">
                    <button className="btn btn-primary shadow-lg rounded-pill mx-2"> Add Session </button>
                </div>
            </div>

            <div className="row d-flex flwx-wrap justify-content-center ">
                <div className="col-sm-6">
                    <div className="shadow-lg py-3 px-1 mx-1 rounded">
                        <h5 className="fw-bold m-2">Classroom</h5>
                        
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="shadow-lg py-3 px-1 mx-1 rounded">
                        <h5 className="fw-bold m-2">Section</h5>
                    </div>
                </div>
            </div>
        </div>

    </NavigationBar>
  )
}

export default Settings