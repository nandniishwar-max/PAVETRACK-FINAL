# PaveTrack — Backend + Frontend Connected

## Local development

### 1. Backend
```bash
cd PaveTrack/backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend:
- API: http://localhost:8000
- Swagger: http://localhost:8000/docs

### 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend:
- http://localhost:5173

The Vite proxy in `frontend/vite.config.js` sends `/api/*` and `/uploads/*` to `http://localhost:8000`.

## What was connected

- Citizen pothole report -> file upload -> backend report creation
- Complaint list/details -> FastAPI reports
- Dashboard statistics -> new `/api/dashboard/stats`
- Contractor repair evidence -> upload -> `/api/repairs/verify`
- Repair submission automatically triggers `/api/verification/{id}`
- AI verification results -> complaint details/verification page
- Contractor assignment -> `/api/reports/{id}/status`
- Manual-review status updates -> same status endpoint
- Approve & close -> `/api/approval/{id}`
- Backend responses are normalized in `frontend/src/services/api.js` so the existing UI can keep using its `complaint_id`, `location`, `photos_before`, `status_history`, and `repair_submission` structure.

## Important

Do not commit real secrets or `.env` files. For deployment, set `VITE_API_BASE_URL` to the public backend URL and configure the backend/database appropriately.
