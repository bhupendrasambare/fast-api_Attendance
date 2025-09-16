import api from "./api";
import {
  GET_CLASSROOM,
  GET_CLASSROOM_BY_SESSION,
  GET_SECTION,
  GET_SECTION_BY_CLASSROOM,
  GET_SESSIONS,
} from "./urls";


export const fetchSessions = async () => {
  try {
    const res = await api.get(GET_SESSIONS);
    return res.data; 
  } catch (err) {
    console.error("Error fetching sessions:", err);
    return [];
  }
};


export const fetchClassroom = async (sessionId) => {
  try {
    const url = sessionId ? GET_CLASSROOM_BY_SESSION(sessionId) : GET_CLASSROOM;
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.error("Error fetching classrooms:", err);
    return [];
  }
};


export const fetchSections = async (classroomId, sessionId) => {
  try {
    if (!classroomId && !sessionId) {
      return [];
    }

    const url = sessionId
      ? GET_SECTION_BY_CLASSROOM(classroomId)
      : GET_SECTION;

    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.error("Error fetching sections:", err);
    return [];
  }
};