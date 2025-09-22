export const BASE_LINK = "http://localhost:8000/"
export const BASE_URL = "http://localhost:8000/api/v1"
export const AUTH_LOGIN = "/auth/login";
export const AUTH_REGISTER = "/auth/register";
export const GET_STUDENTS = "/students/get";
export const ADD_STUDENT = "/students/add";
export const CHECK_ATTENDANCE = "/attendance/check-attendance";
export const GET_SESSIONS = BASE_URL + "/sessions/";
export const GET_CLASSROOM = BASE_URL + `/classrooms/`;
export const GET_SECTION = BASE_URL + `/sections/`;
export const GET_CLASSROOM_BY_SESSION =(sessionId) => {return (BASE_URL + `/classrooms/?session_id=${sessionId}`)};
export const GET_SECTION_BY_CLASSROOM =(classroomId) => {return (BASE_URL + `/sections/?classroom_id=${classroomId}`)};