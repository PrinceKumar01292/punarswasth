from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL                 = os.getenv("DATABASE_URL", "postgresql://postgres:admin123@localhost/punarswasth")
SECRET_KEY                   = os.getenv("SECRET_KEY", "fallback-secret")
ALGORITHM                    = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES  = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

OPENAI_API_KEY               = os.getenv("OPENAI_API_KEY", "")
TWILIO_ACCOUNT_SID           = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN            = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_WHATSAPP_FROM         = os.getenv("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886")

APP_NAME                     = os.getenv("APP_NAME", "PunarSwasth")
DEBUG                        = os.getenv("DEBUG", "True") == "True"
