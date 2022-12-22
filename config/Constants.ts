// Constants
export const batches = <const>["BCS", "IMT", "IMG", "MBA", "MTECH", "PHD", null];

export const roles = <const>["STUDENT", "FACULTY", "ADMIN", "STAFF"];

export const hostels = <const>["BH-1 Aravali Hostel", "BH-2 Nilgiri Hostel", "BH-3 Shivalik Hostel", "GH Girls Hostel", "IVH - Visitor's Hostel", null];

export const complaintStatuses = <const>["PENDING REVIEW", "UNDER CONSIDERATION", "RESOLVED", "REJECTED"];

export const complaintDepartments = <const>["HOSTEL DEPARTMENT", "ACADEMICS DEPARTMENT", "ELECTRICITY DEPARTMENT", "WATER DEPARTMENT", "INTERNET DEPARTMENT", "OTHERS"];

export const instituteDepartments = <const>["Electrical/Electronics", "Information Technology", "Management Studies", "Computer Science", "Applied Science"];

export const instituteBlocks = <const>{
    "Electrical/Electronics": "A - Block",
    "Information Technology": "B - Block",
    "Management Studies": "C - Block",
    "Computer Science": "D - Block",
    "Applied Science": "E - Block"
};

export const instituteDesignations = <const>["Director", "Professor", "Professor & Head", "Assistant Professor", "Associate Professor", "Hostel Supervisor", "Librarian", "Warden", "Other"];

export const statusFilters: any = {
    "pendingReview": "PENDING REVIEW",
    "underConsideration": "UNDER CONSIDERATION",
    "resolved": "RESOLVED",
    "rejected": "REJECTED",
}

export const complaintDepartmentFilters = {
    "hostelDepartment": "HOSTEL DEPARTMENT",
    "academicsDepartment": "ACADEMICS DEPARTMENT",
    "electricityDepartment": "ELECTRICITY DEPARTMENT",
    "waterDepartment": "WATER DEPARTMENT",
    "internetDepartment": "INTERNET DEPARTMENT",
    "others": "OTHERS",
}