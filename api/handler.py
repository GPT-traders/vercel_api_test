from mangum import Mangum
from .main import app

# Create the handler for Vercel with proper configuration
handler = Mangum(
    app, 
    lifespan="off"
) 