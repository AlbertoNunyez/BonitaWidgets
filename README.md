# BonitaWidgets

A collection of useful custom widgets for Bonita BPM platform that enhance form functionality and user experience.

## Overview

This repository contains a curated collection of custom widgets designed to extend the capabilities of Bonita BPM forms. Each widget is crafted to solve common UI/UX challenges in business process applications.

## Available Widgets

### 1. **Date Range Picker**
- **Purpose**: Select date ranges with an intuitive calendar interface
- **Use Cases**: Filtering reports, booking periods, project timelines
- **Features**: Customizable date formats, validation, localization support

### 2. **Advanced Data Table**
- **Purpose**: Display and interact with tabular data
- **Use Cases**: Dynamic data display, sorting, filtering, pagination
- **Features**: Column sorting, search, responsive design, export functionality

### 3. **File Upload with Preview**
- **Purpose**: Upload files with thumbnail previews
- **Use Cases**: Document management, image uploads, file attachments
- **Features**: Drag & drop, file type validation, preview thumbnails, progress indicators

### 4. **Chart Visualization**
- **Purpose**: Display data in various chart formats
- **Use Cases**: Dashboards, reports, data analysis
- **Features**: Multiple chart types (bar, line, pie), responsive, interactive

### 5. **Multi-Select Dropdown**
- **Purpose**: Select multiple options from a dropdown list
- **Use Cases**: Category selection, user assignments, tag management
- **Features**: Search/filter, select all/none, custom styling

## Installation

1. Download the desired widget folder from this repository
2. Import the widget into your Bonita Studio:
   - Go to **Development** → **UI Designer**
   - Click **Import** and select the widget ZIP file
   - The widget will be available in your widget palette

## Usage

Each widget comes with:
- **Template**: HTML structure with AngularJS directives
- **Controller**: JavaScript logic and data binding
- **CSS**: Styling and responsive design
- **Help**: Documentation and usage examples

### Basic Integration

1. Drag the widget from the palette to your form
2. Configure properties in the widget property panel
3. Bind data variables as needed
4. Preview and test in the UI Designer

## Widget Structure

Each widget follows the standard Bonita widget structure:
```
widget-name/
├── widget-name.json          # Widget metadata and properties
├── widget-name.js            # Controller logic
├── widget-name.html          # Template markup
├── widget-name.css           # Styling
├── help.html                 # Usage documentation
├── assets/                   # Static assets (images, fonts)
└── examples/                 # Usage examples and demos
```

## Development Guidelines

### Creating Custom Widgets

1. **Follow Bonita Standards**: Use AngularJS 1.x directives and Bonita APIs
2. **Responsive Design**: Ensure widgets work on mobile and desktop
3. **Accessibility**: Include ARIA labels and keyboard navigation
4. **Localization**: Support multiple languages where applicable
5. **Testing**: Include examples and test cases

### Best Practices

- Use semantic HTML elements
- Implement proper error handling
- Follow consistent naming conventions
- Document all properties and methods
- Optimize for performance

## Compatibility

- **Bonita Version**: 7.x and above
- **Browsers**: Chrome, Firefox, Safari, Edge
- **Dependencies**: AngularJS 1.x (included with Bonita)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Implement your widget following the structure guidelines
4. Add documentation and examples
5. Submit a pull request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or feature requests, please open an issue in this repository.

---

**Note**: These widgets are community-contributed and not officially supported by Bonitasoft. Use in production environments should be thoroughly tested.