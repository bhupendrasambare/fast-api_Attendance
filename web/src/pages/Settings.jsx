import React, { useState } from 'react'
import NavigationBar from '../components/Navbar'
import { Table } from 'react-bootstrap';

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
                        <h5 className="fw-bold m-2">Classrooms</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>Sr no.</th>
                                <th>Session</th>
                                <th>Session status</th>
                                <th>Class name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1.</td>
                                    <td>2019 - 2023</td>
                                    <td>Active</td>
                                    <td>XII</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="shadow-lg py-3 px-1 mx-1 rounded">
                        <h5 className="fw-bold m-2">Section</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>Sr no.</th>
                                <th>Session</th>
                                <th>Session status</th>
                                <th>Class name</th>
                                <th>Section name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1.</td>
                                    <td>2019 - 2023</td>
                                    <td>Active</td>
                                    <td>XII</td>
                                    <td>A</td>
                                </tr>
                                <tr>
                                    <td>1.</td>
                                    <td>2019 - 2023</td>
                                    <td>Active</td>
                                    <td>XII</td>
                                    <td>B</td>
                                </tr>
                                <tr>
                                    <td>1.</td>
                                    <td>2019 - 2023</td>
                                    <td>Active</td>
                                    <td>XII</td>
                                    <td>C</td>
                                </tr>
                                <tr>
                                    <td>1.</td>
                                    <td>2019 - 2023</td>
                                    <td>Active</td>
                                    <td>XII</td>
                                    <td>D</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>

    </NavigationBar>
  )
}

export default Settings