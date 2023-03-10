const Messages = {
  // General
  serverError: "Server Error. Please try again Later",
  unauthorized: "You are not authorized to access this link. Sign in again to continue.",
  unAuthorizedRequest: "Unauthorized Request to this API",
  tokenMissing: "Authentication Token Required",
  tokenRefreshed: "Token Refreshed Successfully",
  tokenExpired: "Token Expired",

  // Auth
  accountMissing: "Account with this Email does not exist!",
  emailRequired: "Email is Required",
  invalidUserId: "Invalid User ID",
  invalidEmail: "Invalid Email. Email Should be from IIITM Domain",
  invalidStudentEmail: "Invalid Student Email.",
  invalidCredentials: "Invalid Credentials",
  emailAlreadyInUse: "Account with this Email already exist.",
  emailAlreadyVerified: "Email is already verified. Get additional details",
  correctPassword: "Password is correct",
  incorrectPassword: "Password is incorrect",
  uniqueRegister: "Email should be unique",
  emailNotVerified: "Email is not verified. Verify email first",
  loggedIn: "Logged In Successfully",
  invalidResetID: "Invalid Reset ID",
  currentPasswordError: "Invalid Current Password",
  passwordChanged: "Password Changed Successfully",
  loggedtOut: "Logged Out Successfully",
  passwordReset: "Password Reset Successfully",
  accountCreated: "Account Created Successfully",
  logoutSuccess: "Logged Out Successfully",
  userDetails: "User Details Fetch Successfully",
  alreadyAdmin: "User is already an Admin",
  adminCriteriaError: "Admin Roles can be assigned to faculty/staff only",
  roleUpdated: "Role Updated Successfully",
  notAdmin: "User is not an Admin",

  // OTP 
  otpExpired: "OTP Expired",
  invalidOtp: "Invalid OTP",
  otpVerified: "OTP Verified Successfully",
  invalidVerifiedId: "Invalid Verified ID",
  otpSent: "OTP Sent Successfully",

  // Complaints
  complaintCreated: "Complaint Created Successfully",
  complaintNotFound: "Complaint Not Found",
  complaintDetails: "Complaint Details",
  complaintEdited: "Complaint Edited Successfully",
  complaintAdminInvalid: "Admin can view/edit complaints of his/her department only",
  alreadyRejected: "Complaint is already rejected",
  complaintRejected: "Complaint Rejected Successfully",
  alreadyResolved: "Complaint is already resolved",
  complaintResolved: "Complaint Resolved Successfully",
  complaintDeleted: "Complaint Deleted Successfully",
  alreadyUnderConsideration: "Complaint is already under consideration",
  complaintUnderConsideration: "Complaint Under Consideration Successfully",
  addedComment: "Comment Added Successfully",
  commentNotFound: "Comment Not Found",
  commentDeleted: "Comment Deleted Successfully",
  commentAlreadyDeleted: "Comment is already deleted",
  complaintDepartmentMissing: "You should be ADMIN and should be assigned to a department to view/edit complaints",

  // Suggestions
  suggestionCreated: "Suggestion Created Successfully",
  sugggDepartRequired: "Department is required for suggestions",

};

export default Messages;
