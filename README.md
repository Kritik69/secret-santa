# Secret Santa Management Application

A professional web application for organizing and managing Secret Santa gift exchanges within organizations. Built with Next.js and Material UI, this application streamlines the process of participant management and gift assignment generation.

## Core Features

- **Participant Management**
  - Import participant data from Excel files
  - Add and remove participants manually
  - Paginated participant list with search functionality
  - Interactive user interface with smooth animations

- **Assignment Generation**
  - Automated Secret Santa pair generation
  - Ensures fair and random assignments
  - Prevents self-assignments
  - Maintains assignment history

- **Data Management**
  - Excel file integration for bulk operations
  - Export assignments in standardized format
  - Secure data handling
  - Efficient state management

- **User Interface**
  - Modern, responsive design
  - Intuitive navigation
  - Real-time feedback
  - Loading states and animations
  - Pagination for large datasets

## Technical Requirements

- Node.js 16.8 or later
- npm (Node Package Manager)
- Modern web browser with JavaScript enabled

## Installation Guide

1. Clone the repository:
```bash
git clone <repository-url>
cd secret-santa-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Access the application:
   - Open your web browser
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Usage Instructions

### Participant Management

1. **Adding Participants**
   - Use the "Upload Excel" button to import participant data
   - Click "Add Participant" for manual entry
   - Required fields: Name and Email address

2. **Managing Participants**
   - View all participants in a paginated list
   - Remove participants using the delete button
   - Search and filter participants as needed

### Assignment Generation

1. **Creating Assignments**
   - Navigate to the Results section
   - Click "Generate New Assignments"
   - Review the generated pairs
   - Export results if satisfied

2. **Exporting Results**
   - Click "Export Results" to download assignments
   - File format: Excel (.xlsx)
   - Contains all necessary participant information

## Excel File Format

The application expects Excel files with the following column headers:
- Employee_Name
- Employee_EmailID
- Secret_Child_Name (optional)
- Secret_Child_EmailID (optional)

## Technology Stack

- **Frontend Framework**: Next.js 14
- **UI Library**: Material UI
- **Styling Solution**: Emotion
- **Data Processing**: XLSX
- **State Management**: React Context

## Development

- Written in modern JavaScript
- Follows React best practices
- Implements responsive design principles
- Includes error handling and validation

## License

This project is licensed under the MIT License. See the LICENSE file for details. #   s e c r e a t - s a n t a  
 