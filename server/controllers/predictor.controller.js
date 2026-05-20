import axios from "axios";

// The URL of your Python microservice
const PYTHON_API_URL = "http://localhost:5001/predict";

export const getCollegePrediction = async (req, res) => {
  // 1. Log when the function is first hit
  console.log("\n[PREDICTOR] Controller was hit!");

  try {
    // 2. Log the data we received from the React app
    console.log("[PREDICTOR] Data received from client:", req.body);

    const {
      quota,
      pool,
      category,
      user_rank
      // Opening,
      // Closing,
    } = req.body;

    // 3. Log the data we are about to send to Python
    const modelData = {
      quota,
      pool,
      category,
      user_rank:parseFloat(user_rank),
      // Opening,
      // Closing,
    };
    console.log("[PREDICTOR] Sending this data to Python:", modelData);

    // 4. Log right before the call
    console.log("[PREDICTOR] Calling Python API at:", PYTHON_API_URL);
    const { data } = await axios.post(PYTHON_API_URL, modelData);

    // 5. Log the successful response from Python
    console.log("[PREDICTOR] Got response from Python:", data);

    // 6. Send the prediction back to the React client
    res.status(200).json(data);

  } catch (error) {
    // 7. If ANY error happens, log it!
    console.error("--- [PREDICTOR] ERROR ---");
    if (error.response) {
      // Error from the Python service (e.g., 400, 500)
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
    } else if (error.request) {
      // Request was made but no response received (e.g., ECONNREFUSED)
      console.error("Error request:", error.request);
    } else {
      // Something else bad happened
      console.error("Error message:", error.message);
    }
    console.error("--------------------------");

    res.status(500).json({
      message: "Error getting prediction",
      error: error.message,
    });
  }
};