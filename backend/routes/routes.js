const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/controller");
const verifyToken = require("../verifytoken");


// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// =================== AUTH ===================
router.post("/register", upload.single("profileImage"), controller.register);
router.post("/login", controller.login);

// =================== USERS ===================
// Specific routes first
router.get("/users/me", verifyToken, controller.getMyProfile);
router.get("/users/search", controller.searchUsers);
router.get("/users/blocked", verifyToken, controller.listBlockedUsers);
router.get("/users/:username", controller.getUserByUsername);

// =================== FRIENDSHIP ===================
router.post("/friendship/sendRequest", verifyToken, controller.sendFriendRequest);
router.post("/friendship/acceptRequest", verifyToken, controller.acceptFriendRequest);
router.get("/friendship/list/:username", verifyToken, controller.listFriends);
router.get("/friendship/pendingRequests", verifyToken, controller.listPendingRequests);
router.get("/friendship/sentRequests", verifyToken, controller.getSentRequests);
router.post("/friendship/cancelRequest", verifyToken, controller.cancelFriendRequest);
router.post("/friendship/unfriend", verifyToken, controller.unfriend);
router.post("/friendship/declineRequest", verifyToken, controller.declineFriendRequest);

// =================== MESSAGING ===================
router.post("/message/send", verifyToken, controller.sendMessage);
router.get("/message/conversation/:friend_id", verifyToken, controller.getConversation);

// =================== BLOCKING ===================
router.post("/block", verifyToken, controller.blockUser);
router.post("/unblock", verifyToken, controller.unblockUser);
router.get("/blocked", verifyToken, controller.listBlockedUsers);

// =================== PROFILE UPDATE ===================
router.put("/users/update", verifyToken, upload.single("profileImage"), controller.updateUserProfile);

// =================== FEED / CONTRIBUTION ===================
// Create a new post (multiple images + caption)
router.post("/feed/createPost", verifyToken, upload.array("images", 10), controller.createPost);

// Get all posts by friends
router.get("/feed/posts", verifyToken, controller.getFriendsPosts);

// React to a post (like/love)
router.post("/feed/react", verifyToken, reactToPostController);


// Get single post with images and reactions
router.get("/feed/post/:post_id", verifyToken, controller.getPostById);

// Get logged-in user's posts
router.get("/feed/myPosts", verifyToken, controller.getMyPosts);

// =================== COMMENTS ===================
// Add a comment to a post
router.post("/feed/comment", verifyToken, controller.addComment);

// Get all comments for a post
router.get("/feed/comments/:post_id", verifyToken, controller.getComments);
module.exports = router;
