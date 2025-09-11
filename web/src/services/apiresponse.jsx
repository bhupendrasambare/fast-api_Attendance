import { BASE_URL, GET_CLASSROOM, GET_CLASSROOM_BY_SESSION, GET_SECTION, GET_SECTION_BY_CLASSROOM, GET_SESSIONS } from "../services/urls";

export const fetchSessions = async () => {
    try {
        const res = await fetch(GET_SESSIONS, {
        headers: { accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch sessions");
        return await res.json();
    } catch (err) {
        console.error("Error fetching sessions:", err);
        return [];
    }
};

export const fetchClassroom = async (sessionId) => {
    try {
        console.log(sessionId)
        const url = sessionId ? GET_CLASSROOM_BY_SESSION(sessionId) : GET_CLASSROOM;

        const res = await fetch(url, { headers: { accept: "application/json" } });
        if (!res.ok) throw new Error("Failed to fetch classrooms");

        return await res.json();
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

        const url = sessionId ? GET_SECTION_BY_CLASSROOM(classroomId) : GET_SECTION;

        const res = await fetch(url, { headers: { accept: "application/json" } });
        if (!res.ok) throw new Error("Failed to fetch sections");

        return await res.json();
    } catch (err) {
        console.error("Error fetching sections:", err);
    return [];
    }
};