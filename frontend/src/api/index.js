import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const api = {
  getDustReadings: (params) => request.get('/dust-readings', { params }),
  getDustReadingStats: (params) => request.get('/dust-readings/stats', { params }),
  getDustReadingTrend: (params) => request.get('/dust-readings/trend', { params }),
  getOverlimitAlerts: (params) => request.get('/dust-readings/overlimit', { params }),

  getVehicleRecords: (params) => request.get('/vehicle-records', { params }),
  getVehicleRecord: (id) => request.get(`/vehicle-records/${id}`),
  createVehicleRecord: (data) => request.post('/vehicle-records', data),
  updateVehicleRecord: (id, data) => request.put(`/vehicle-records/${id}`, data),
  deleteVehicleRecord: (id) => request.delete(`/vehicle-records/${id}`),

  getRectificationTasks: (params) => request.get('/rectification-tasks', { params }),
  getRectificationTask: (id) => request.get(`/rectification-tasks/${id}`),
  createRectificationTask: (data) => request.post('/rectification-tasks', data),
  updateRectificationTask: (id, data) => request.put(`/rectification-tasks/${id}`, data),
  submitRectification: (id, data) => request.put(`/rectification-tasks/${id}/submit`, data),
  reviewRectification: (id, passed) => request.put(`/rectification-tasks/${id}/review?passed=${passed}`),
  deleteRectificationTask: (id) => request.delete(`/rectification-tasks/${id}`),

  getReviewEvidences: (params) => request.get('/review-evidences', { params }),
  getReviewEvidence: (id) => request.get(`/review-evidences/${id}`),
  createReviewEvidence: (data) => request.post('/review-evidences', data),
  deleteReviewEvidence: (id) => request.delete(`/review-evidences/${id}`),

  getPenalties: (params) => request.get('/penalties', { params }),
  getPenalty: (id) => request.get(`/penalties/${id}`),
  createPenalty: (data) => request.post('/penalties', data),
  updatePenalty: (id, data) => request.put(`/penalties/${id}`, data),
  deletePenalty: (id) => request.delete(`/penalties/${id}`),

  getComplaints: (params) => request.get('/complaints', { params }),
  getComplaint: (id) => request.get(`/complaints/${id}`),
  createComplaint: (data) => request.post('/complaints', data),
  dispatchComplaint: (id, data) => request.put(`/complaints/${id}/dispatch`, data),
  processComplaint: (id, data) => request.put(`/complaints/${id}/process`, data),
  closeComplaint: (id) => request.put(`/complaints/${id}/close`),
  deleteComplaint: (id) => request.delete(`/complaints/${id}`),

  getConstructionSites: (params) => request.get('/construction-sites', { params }),
  getConstructionSite: (id) => request.get(`/construction-sites/${id}`),
  createConstructionSite: (data) => request.post('/construction-sites', data),
  updateConstructionSite: (id, data) => request.put(`/construction-sites/${id}`, data),
  deleteConstructionSite: (id) => request.delete(`/construction-sites/${id}`),

  getVehicles: (params) => request.get('/vehicles', { params }),
  getVehicle: (id) => request.get(`/vehicles/${id}`),
  createVehicle: (data) => request.post('/vehicles', data),
  updateVehicle: (id, data) => request.put(`/vehicles/${id}`, data),
  deleteVehicle: (id) => request.delete(`/vehicles/${id}`),

  getEarthworkPlans: (params) => request.get('/earthwork-plans', { params }),
  getEarthworkPlan: (id) => request.get(`/earthwork-plans/${id}`),
  createEarthworkPlan: (data) => request.post('/earthwork-plans', data),
  updateEarthworkPlan: (id, data) => request.put(`/earthwork-plans/${id}`, data),
  deleteEarthworkPlan: (id) => request.delete(`/earthwork-plans/${id}`),

  getWashRecords: (params) => request.get('/wash-records', { params }),
  getWashRecord: (id) => request.get(`/wash-records/${id}`),
  createWashRecord: (data) => request.post('/wash-records', data),
  confirmWash: (id) => request.put(`/wash-records/${id}/confirm`),
  deleteWashRecord: (id) => request.delete(`/wash-records/${id}`),

  getNightExcavationApprovals: (params) => request.get('/night-excavation-approvals', { params }),
  getNightExcavationApproval: (id) => request.get(`/night-excavation-approvals/${id}`),
  createNightExcavationApproval: (data) => request.post('/night-excavation-approvals', data),
  updateNightExcavationApproval: (id, data) => request.put(`/night-excavation-approvals/${id}`, data),
  approveNightExcavation: (id, data) => request.put(`/night-excavation-approvals/${id}/approve`, data),
  rejectNightExcavation: (id, data) => request.put(`/night-excavation-approvals/${id}/reject`, data),
  deleteNightExcavationApproval: (id) => request.delete(`/night-excavation-approvals/${id}`),
}

export default request
