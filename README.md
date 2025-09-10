# Gemini Productivity Tracker

A daily productivity tracker to manage tasks and visualize progress, enhanced with AI-powered motivational quotes and daily summaries from Gemini.

## Deploying with Docker

Follow these instructions to run the application on your local machine using Docker.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running on your machine.

### Instructions

1.  **Save all files:** Ensure that `Dockerfile`, `docker-compose.yml`, and all other application files (`index.html`, `index.tsx`, etc.) are in the same directory.

2.  **Open your terminal:** Navigate to the project directory where you saved the files.

3.  **Build and run the container:** Execute the following command in your terminal. This will build the Docker image and start the application container in the background.

    ```bash
    docker-compose up --build -d
    ```
    *   `--build` ensures the image is rebuilt if you make changes to the Dockerfile or app code.
    *   `-d` runs the container in detached mode (in the background).

4.  **Access the application:** Open your web browser and go to the following address:

    [http://localhost:8080](http://localhost:8080)

The productivity tracker should now be running!

### Stopping the Application

To stop the container, run the following command in the same directory:

```bash
docker-compose down
```

### A Note on Data Persistence

This application uses your web browser's **`localStorage`** to save your tasks, categories, and tracked time.

-   **Your data is safe:** The data is stored on your own computer within the browser. It is not stored inside the Docker container.
-   **Persistence is automatic:** This means you can stop, remove, and restart the Docker container at any time without losing your data. As long as you use the same web browser and do not clear its cache or site data, your tasks will remain.
