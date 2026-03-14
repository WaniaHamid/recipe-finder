import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MealPlan from '@/models/MealPlan';

// GET all meal plans for a user
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const mealPlans = await MealPlan.find({ userId }).populate('meals.recipeId');

    return NextResponse.json({
      success: true,
      mealPlans
    });

  } catch (error) {
    console.error('Get meal plans error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// CREATE new meal plan
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId, name, startDate, endDate, meals } = body;

    if (!userId || !name || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const mealPlan = new MealPlan({
      userId,
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      meals: meals || []
    });

    await mealPlan.save();

    return NextResponse.json({
      success: true,
      mealPlan
    }, { status: 201 });

  } catch (error) {
    console.error('Create meal plan error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE meal plan
export async function PUT(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Meal plan ID is required' },
        { status: 400 }
      );
    }

    const updatedMealPlan = await MealPlan.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('meals.recipeId');

    if (!updatedMealPlan) {
      return NextResponse.json(
        { success: false, error: 'Meal plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      mealPlan: updatedMealPlan
    });

  } catch (error) {
    console.error('Update meal plan error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE meal plan
export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Meal plan ID is required' },
        { status: 400 }
      );
    }

    const deletedMealPlan = await MealPlan.findByIdAndDelete(id);

    if (!deletedMealPlan) {
      return NextResponse.json(
        { success: false, error: 'Meal plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Meal plan deleted successfully'
    });

  } catch (error) {
    console.error('Delete meal plan error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}