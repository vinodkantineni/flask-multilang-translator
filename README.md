# Flask MultiLang Translator

A simple and elegant web-based translation application built with Flask. Features real-time translation using the MyMemory API, a modern dark/light mode UI, and a built-in feedback system.

## Repository Details

- **Repository Name**: `flask-multilang-translator`
- **Description**: A Flask-based web translation app using MyMemory API. Features include multi-language support, modern dark/light UI, and a CSV-based feedback system. Simple, lightweight, and ready to deploy.

## Features

- **Multi-Language Translation**: Supports translation between various languages including English, Spanish, French, German, Italian, Hindi, Japanese, Korean, and Chinese.
- **Modern UI**: Clean interface with Dark/Light mode toggle.
- **Modes**:
    - **Text Mode**: Type to translate.
    - **Voice Mode**: (UI placeholder) Switch for voice interactions.
- **Feedback System**: Built-in feedback form that saves user suggestions and issues to a CSV file (`feedback.csv`).
- **Responsive Design**: Works well on different screen sizes.

## Technology Stack

- **Backend**: Python (Flask)
- **Frontend**: HTML5, CSS3, JavaScript
- **API**: [MyMemory Translation API](https://mymemory.translated.net/)
- **Data Storage**: CSV (for feedback)

## Prerequisites

- Python 3.x installed on your system.

## Installation and Setup

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:
    You can install the required Python packages using pip:

    ```bash
    pip install flask requests
    ```

3.  **Run the Application**:
    Execute the `app.py` script to start the Flask server:

    ```bash
    python app.py
    ```


## Project Structure

```text
multilang-translator/
├── app.py              # Main Flask application file
├── feedback.csv        # Stores user feedback (auto-created)
├── static/
│   ├── style.css       # Application styling
│   └── script.js       # Frontend logic (API calls, UI toggles)
└── templates/
    └── index.html      # Main HTML template
```

## API Usage

This project uses the free tier of the **MyMemory API**.
- **Endpoint**: `https://api.mymemory.translated.net/get`
- **Note**: For heavy generic usage, it is recommended to provide a valid email in the API request or upgrade to a paid plan.

## Feedback System

The application includes a feedback button (exclamation mark icon) at the bottom right.
- Submitting the feedback form saves the data (Timestamp, Name, Email, Problem, Suggestion) to `feedback.csv` in the root directory.


