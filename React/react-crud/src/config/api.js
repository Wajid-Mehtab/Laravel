const API_BASE_URL = "http://localhost:8000/api";

export const SAVE_CONTACT_URL = `${API_BASE_URL}/contacts`;

export const Update_CONTACT_URL = (id) => `${API_BASE_URL}/contacts/${id}`;
// Add more endpoints if needed
export const GET_CONTACTS_URL = `${API_BASE_URL}/adsdsdsdsd`;


export default {
    API_BASE_URL,
    SAVE_CONTACT_URL,
    GET_CONTACTS_URL,
    Update_CONTACT_URL,

};
