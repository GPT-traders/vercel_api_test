def handler(request):
    """Simple test handler to verify Python is working on Vercel"""
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
        },
        "body": {
            "message": "Python handler is working!",
            "status": "success",
            "deployment": "vercel",
            "runtime": "python"
        }
    } 