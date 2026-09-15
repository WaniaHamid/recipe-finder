import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    
    const { name, email, password } = await request.json();

    console.log('Registration request received for:', email ? email.toLowerCase() : 'unknown');

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      favoriteRecipes: [],
      mealPlans: [],
      groceryLists: [],
      preferences: {
        dietaryRestrictions: [],
        cuisinePreferences: [],
        allergies: []
      }
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: errors[0] },
        { status: 400 }
      );
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      // Check if it's a username index error (legacy)
      if (error.keyPattern && error.keyPattern.username) {
        try {
          await User.collection.dropIndex('username_1');
          await user.save();
          const token = generateToken(user._id);
          const { password: _, ...userWithoutPassword } = user.toObject();
          return NextResponse.json({
            success: true,
            data: {
              user: userWithoutPassword,
              token
            }
          }, { status: 201 });
        } catch (dropErr) {
          console.error('Failed to auto-resolve username index:', dropErr);
          return NextResponse.json(
            { success: false, error: 'Database index conflict: A legacy username index exists in Atlas. Please drop username_1 in MongoDB Atlas.' },
            { status: 500 }
          );
        }
      }
      // Regular email duplicate error
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    if (error.name === 'MongooseServerSelectionError') {
      return NextResponse.json(
        { success: false, error: 'Database connection failed: Could not connect to MongoDB Atlas. Please verify Network Access (0.0.0.0/0) and MONGODB_URI in Vercel.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}