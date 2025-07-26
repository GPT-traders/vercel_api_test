// Next.js API route for data processing

export default function handler(req, res) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    try {
      const { message, data } = req.body;

      if (!message) {
        return res.status(400).json({
          error: "Message is required",
          example: { message: "Hello World", data: [1, 2, 3] },
        });
      }

      // Process the data
      const processedData = {
        originalMessage: message,
        processedMessage: message.toUpperCase(),
        reversedMessage: message.split("").reverse().join(""),
        wordCount: message.split(" ").length,
        charCount: message.length,
        timestamp: new Date().toISOString(),
        processedBy: "Node.js API",
        data: data
          ? {
              original: data,
              doubled: Array.isArray(data) ? data.map((x) => x * 2) : data,
              type: Array.isArray(data) ? "array" : typeof data,
            }
          : null,
      };

      res.status(200).json({
        success: true,
        result: processedData,
      });
    } catch (error) {
      res.status(500).json({
        error: "Processing failed",
        details: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
