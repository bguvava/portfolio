# Brian Guvava Portfolio Website

A modern, responsive one-page portfolio website showcasing Brian Guvava's professional experience and projects in IT.

## Features

- Responsive design that works on mobile, tablet, and desktop devices
- Interactive project showcase with filterable categories
- Dark/light mode toggle
- Contact form with validation and security measures
- Smooth scrolling and subtle animations
- Project modal popups for detailed information
- Downloadable CV option

## Installation

### Prerequisites

- XAMPP (or similar local server environment with PHP support)
- Web browser (Chrome, Firefox, Safari, Edge recommended)

### Setup Instructions

1. Clone this repository to your local XAMPP htdocs folder:
```
git clone https://github.com/bguvava/bguvava.git c:/xampp/htdocs/bguvava
```

2. Start Apache server in XAMPP Control Panel

3. Navigate to the website in your browser:
```
http://localhost/bguvava/
```

## Project Structure

- `/assets` - Contains all static assets
  - `/css` - CSS stylesheets
  - `/js` - JavaScript files
  - `/img` - Images and icons
  - `/fonts` - Custom fonts
  - `/uploads` - Uploaded content
- `/modals` - Project modal popup templates
- `/docs` - Documentation files
- `/vendor` - Third-party libraries
- `/logs` - Log files (not committed to repository)

## Technologies Used

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript/jQuery
- Chart.js
- SweetAlert2
- FontAwesome
- DataTables.js
- FullCalendar.js
- Dropzone.js

### Backend
- PHP
- PHPMailer
- FPDF/MPDF/TCPDF
- PhpSpreadsheet

## Customization

### Changing Colors

The color scheme is defined in `assets/css/variables.css` using CSS variables. You can easily modify the colors by changing the HEX values.

### Adding Projects

Projects data is stored in the Projects.txt file and processed dynamically. To add a new project, follow the format in the existing file.

### Updating Content

Most content can be updated directly in the HTML files or through the respective data files.

## License

All rights reserved. This code is not open source.

## Author

Brian Tinashe Guvava
