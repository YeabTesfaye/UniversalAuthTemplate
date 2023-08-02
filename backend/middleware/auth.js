
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtooken'
import { User } from '../models/user';

export const protect = asyncHandler(async (req, res, next) => {
    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(" ")[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const userId = decoded.userId;
         
        // Get user from the token
        req.user = await User.findById(decoded.id).select("-password");
       
        next();
      } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("Not authorized");
      }
    }
  
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  });


  export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode);
    res.json({
      msg: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };


  export const  authenticateUser = (req, res, next)  => {
    // Extract the JWT token from the request headers
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
  
    // If no token is found, return an error response
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    try {
      // Verify the token and extract the user ID from the payload
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const userId = decodedToken.userId;
  
      // Add the user ID to the request object
      req.userId = userId;
  
      // Call the next middleware or route handler
      next();
    } catch (error) {
      // If the token is invalid, return an error response
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
  
  export const authenticateAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  };