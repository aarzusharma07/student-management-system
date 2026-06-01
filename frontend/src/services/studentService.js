import api from './api';

const studentService = {
  // Fetch students with pagination, search, and branch/semester filtering
  getAll: async (params = {}) => {
    const response = await api.get('/students', { params });
    return response.data;
  },

  // Fetch student by DB ID or custom ID
  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Create student (supports FormData for photo upload)
  create: async (studentData) => {
    // If it's a FormData object, Axios will automatically set the correct headers
    const response = await api.post('/students', studentData, {
      headers: {
        'Content-Type': studentData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    });
    return response.data;
  },

  // Update student (supports FormData for photo upload)
  update: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData, {
      headers: {
        'Content-Type': studentData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    });
    return response.data;
  },

  // Delete student
  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  // Fetch dashboard summary stats
  getStats: async () => {
    const response = await api.get('/students/stats/summary');
    return response.data;
  },
};

export default studentService;
