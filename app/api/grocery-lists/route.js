// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import GroceryList from '@/models/GroceryList';

// // GET all grocery lists for a user
// export async function GET(request) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId');

//     if (!userId) {
//       return NextResponse.json(
//         { success: false, error: 'User ID is required' },
//         { status: 400 }
//       );
//     }

//     const groceryLists = await GroceryList.find({ userId }).sort({ createdAt: -1 });

//     return NextResponse.json({
//       success: true,
//       groceryLists
//     });

//   } catch (error) {
//     console.error('Get grocery lists error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // CREATE new grocery list
// export async function POST(request) {
//   try {
//     await connectDB();
    
//     const body = await request.json();
//     const { userId, name, items } = body;

//     if (!userId || !name) {
//       return NextResponse.json(
//         { success: false, error: 'User ID and name are required' },
//         { status: 400 }
//       );
//     }

//     const groceryList = new GroceryList({
//       userId,
//       name,
//       items: items || []
//     });

//     await groceryList.save();

//     return NextResponse.json({
//       success: true,
//       groceryList
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Create grocery list error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // UPDATE grocery list
// export async function PUT(request) {
//   try {
//     await connectDB();
    
//     const body = await request.json();
//     const { id, ...updateData } = body;

//     if (!id) {
//       return NextResponse.json(
//         { success: false, error: 'Grocery list ID is required' },
//         { status: 400 }
//       );
//     }

//     const updatedGroceryList = await GroceryList.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedGroceryList) {
//       return NextResponse.json(
//         { success: false, error: 'Grocery list not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       groceryList: updatedGroceryList
//     });

//   } catch (error) {
//     console.error('Update grocery list error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // DELETE grocery list
// export async function DELETE(request) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return NextResponse.json(
//         { success: false, error: 'Grocery list ID is required' },
//         { status: 400 }
//       );
//     }

//     const deletedGroceryList = await GroceryList.findByIdAndDelete(id);

//     if (!deletedGroceryList) {
//       return NextResponse.json(
//         { success: false, error: 'Grocery list not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Grocery list deleted successfully'
//     });

//   } catch (error) {
//     console.error('Delete grocery list error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }