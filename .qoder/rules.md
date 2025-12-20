# rules.md

Follow these rules

## Guidelines
- Don't include testing as a task and never try to run or compile a script to see if it works unless I ask you to; I will handle it myself. Just mark all tasks as completed after you've made your edits.
- Plan every edge case when architecting any plan.
- Don't overcomplicate tasks.
- Always maintain a planning markdown file in order to keep track of your progress and planning.
- Always keep an eye on the linter and terminal for errors.
- Never use fallbacks. If there's an issue, wrap the logic in a try block and trigger a warning—preferably a popup or explicit alert. Do not silently recover or substitute behavior.
- I am on Windows, so never include Unix/Linux shebangs like `#!/usr/bin/env python3` in scripts. Always assume direct invocation via `python` or `python3` on Windows.

### Global Rule: GUI Framework and Theme
Whenever I request a GUI, the specification must **always** use PySide6 (Qt 6) as the framework, with a **modern dark‑mode design** implemented via Qt stylesheets. Tkinter and CustomTkinter must never be used or suggested.

Dark mode theme — general palette and usage:
- Background: `#1e1e1e` (window and base widgets)
- Surface: `#2d2d2d` (panels, inputs, frames)
- Text primary: `#e0e0e0` (standard text)
- Text inverse: `#ffffff` (titles/emphasis)
- Text muted: `#a0a0a0` (placeholders, secondary labels)
- Border: `#3d3d3d` (standard outlines and separators)
- Accent: `#0d7377` (focus ring, selection highlight, active controls)
- Disabled: `#252525` (readonly/disabled input backgrounds)
- Hover surface: `#2a2a2a` (hover states)
- Font: `Segoe UI`, `13pt` base size

Theme application rules:
- Apply Background to `QMainWindow` and base `QWidget`.
- Use Surface for input fields, frames, and grouped panels.
- Outline inputs and panels with Border; on focus, switch outline to Accent.
- Use Accent for selection backgrounds and progress indicators.
- Use Text muted for placeholders and read‑only labels; Text inverse for group titles.
- Maintain rounded corners between 3–5 px and consistent padding.
- Ensure hover states slightly lighten Surface; avoid bright highlights.
- **All text must use light colors (Text primary, inverse, or muted). Never use black or dark gray for any text.** Any text color must maintain strong contrast against the dark background to guarantee readability.
- **When a GUI contains a long list of items, the window must automatically expand to fit the list without requiring scrolling.** Scrolling should only be used when expansion would exceed the screen height.
- **Every GUI script must declare a global `center_screen = True` at the top of the script.**
- **Every GUI script must declare global `WIDTH` and `HEIGHT` constants for easy resizing:**
  ```python
  WIDTH = 800
  HEIGHT = 600
  ```
  - Use these globals for minimum window sizes and layout calculations
  - If `center_screen = True`, the GUI opens centered on the screen.
  - If `center_screen = False`, the script must call `self.position_window_center_left()` to place the GUI at center‑left:

        def position_window_center_left(self):
            """Position window at center-left of the screen"""
            screen = QApplication.primaryScreen().geometry()
            window_size = self.geometry()
            
            # Position at 1/4 of screen width (center-left)
            x = (screen.width() // 4) - (window_size.width() // 2)
            # Center vertically
            y = (screen.height() - window_size.height()) // 2
            
            self.move(x, y)
			
### Global Rule: Python to Executable Compilation
When compiling Python scripts to executables, **always use Nuitka** instead of PyInstaller. Nuitka compiles Python to native C code, which results in fewer antivirus false positives, no runtime temp folder extraction, and better performance. Use these flags: `--onefile` for single executable, `--windows-console-mode=disable` to hide console, and `--windows-icon-from-ico=<icon_file>` to set the exe icon.

### Global Rule: Folder Opening
When opening folders from scripts or GUIs, use Directory Opus only. Invoke `C:\Program Files\GPSoftware\Directory Opus\dopus.exe` with the target folder path. Do not use Windows Explorer. If opening fails, show an explicit error popup; do not fallback silently.

### Global Rule: GUI Design Best Practices
To prevent common GUI issues and ensure consistent dark mode design:

1. **Window Sizing and Positioning**:
   - Always use `self.adjustSize()` to automatically size windows to content
   - Set reasonable minimum sizes with `self.setMinimumSize(WIDTH, HEIGHT)` using the global constants
   - Use `self.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)` for flexible resizing
   - **Window Positioning Logic**: Use timer-based positioning that respects the `center_screen` global:
     ```python
     import PySide6.QtCore
     if center_screen:
         PySide6.QtCore.QTimer.singleShot(100, self.center_window)
     else:
         PySide6.QtCore.QTimer.singleShot(100, self.position_window_center_left)
     ```
   - **Critical**: The timer ensures positioning happens AFTER window initialization and sizing
   - **Main Window Margins**: Apply consistent margins to the main layout (10-15px) to prevent elements from touching window borders: `layout.setContentsMargins(10, 10, 10, 10)` and `layout.setSpacing(10)`
   - **Internal Spacing**: Use spacing (5-10px) between widgets within the main layout for visual separation

2. **Dark Mode Theme Application**:
   - Apply background colors to ALL widget types including `QMainWindow`, `QWidget`, `QFrame`, `QLabel`, etc.
   - Set `background-color: transparent;` for labels and scroll areas to prevent white backgrounds
   - Ensure all text uses light colors (`#e0e0e0`, `#ffffff`, `#a0a0a0`) - NEVER use black text in dark mode
   - Remove borders from scroll areas: `QScrollArea { background-color: transparent; border: none; }`

3. **Layout and Spacing**:
   - **Main Layout**: Use 10-15px margins on the main layout to prevent elements from touching window borders
   - **Widget Spacing**: Use 5-10px spacing between widgets for visual separation
   - **Frame Padding**: Use 10px padding within QGroupBox and QFrame containers for internal spacing
   - **Window Borders**: Set `border: none;` and `margin: 0px; padding: 0px;` on main window styles to eliminate thick white borders
   - **Visual Hierarchy**: Use QFrame with proper background colors (`#2d2d2d`) and borders (`1px solid #3d3d3d`) for grouped content

4. **Common Issues to Avoid**:
   - **Thick white borders**: Caused by missing `border: none;` and `margin: 0px;` on main window styles
   - **Black text in dark mode**: Always specify light text colors in stylesheets
   - **Uneven spacing**: Use consistent layout margins/spacing and avoid mixing different approaches
   - **Scroll area backgrounds**: Always set `background-color: transparent; border: none;` on scroll areas

5. **Debugging GUI Issues**:
   - Use Qt Designer or similar tools to preview layouts before implementation
   - Test with different window sizes to ensure responsive behavior
   - Check for color contrast issues using accessibility tools
   - Verify all widget types have proper dark mode styling

6. **Application Termination**:
   - **Always implement a `closeEvent` handler** in main window classes to ensure proper application termination
   - The handler must accept the event and call `QApplication.quit()` to force complete termination
   - This prevents the application from remaining active in the terminal after the window is closed
   - Example implementation:
     ```python
     def closeEvent(self, event):
         """Handle the window close event to ensure proper application termination"""
         # Accept the close event
         event.accept()
         # Ensure the application exits completely
         QApplication.quit()
     ```

### Global Rule: Drag and Drop Implementation
When implementing drag and drop functionality in GUI applications, follow these guidelines:

**DropZone Widget Requirements**:
- Create a custom `DropZone(QFrame)` class for drag and drop areas
- Use `QFrame.Box | QFrame.Plain` frame style with visible line width
- Set `setAcceptDrops(True)` to enable drag and drop
- Use a dashed border style (`border: 2px dashed #3d3d3d;`) for the default state
- Change to solid accent border (`border: 2px solid #0d7377;`) on drag enter
- Restore dashed border on drag leave and after successful drop
- Include clear instructional text like "Drop [file type] here"
- Use minimum height of 120px for adequate drop target size

**Event Handling**:
- Implement `dragEnterEvent()` to accept valid file types and change border style
- Implement `dragLeaveEvent()` to restore default border style
- Implement `dropEvent()` to process files and restore border style
- Validate file types before processing (e.g., check file extensions)
- Provide user feedback for invalid file types via message boxes

**Visual Feedback**:
- Use hover states with accent color (#0d7377) for active drag zones
- Maintain consistent dark mode styling with #2d2d2d background
- Use transparent backgrounds for labels within drop zones
- Update drop zone label text after successful file drops
- Ensure clear visual distinction between default and active states

**File Processing**:
- Process multiple files when dropped (iterate through all URLs)
- Store file data in structured format for later validation
- Update UI elements (lists, labels) after processing
- Auto-size window to accommodate new content when needed
- Provide clear error messages for unsupported file types
