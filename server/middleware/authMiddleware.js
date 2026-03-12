import jwt from 'jsonwebtoken';

/**
 * JWT Authentication Middleware
 * Verifies the Bearer token from the Authorization header.
 * On success, attaches decoded user payload to req.user and calls next().
 * On failure, returns 401 Unauthorized.
 */
const authMiddleware = (req, res, next) => {
  // 1. Read the Authorization header
  const authHeader = req.headers.authorization;

  // 2. Check if header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.'
    });
  }

  // 3. Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the decoded user payload to the request object
    req.user = decoded;

    // 6. Pass control to the next middleware/route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token is invalid or expired.'
    });
  }
};

export default authMiddleware;
